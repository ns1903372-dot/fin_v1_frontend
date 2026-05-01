"""
FastAPI Application Entry Point

Main application factory with:
- Middleware configuration (CORS, JWT auth stub)
- Lifespan handlers (database connections)
- Health check endpoint
- Request/response logging
"""

import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware

try:
    import motor.motor_asyncio as motor_asyncio
except ImportError:
    motor_asyncio = None

try:
    import redis.asyncio as redis
except ImportError:
    redis = None

try:
    from sqlalchemy.ext.asyncio import create_async_engine
except ImportError:
    create_async_engine = None

from .schemas import HealthResponse

logger = logging.getLogger(__name__)


class AppState:
    """Global application state."""

    postgres_engine = None
    redis_client = None
    mongodb_client = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager for startup/shutdown.

    Initializes database connections on startup and closes on shutdown.
    """
    logger.info("Starting Axiom Credit API")

    # ===== STARTUP =====
    try:
        # PostgreSQL
        db_url = os.getenv("DATABASE_URL")
        if db_url and create_async_engine is not None:
            try:
                # Convert postgresql:// to postgresql+asyncpg://
                if db_url.startswith("postgresql://"):
                    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://")
                AppState.postgres_engine = create_async_engine(
                    db_url,
                    echo=os.getenv("DEBUG", "False").lower() == "true",
                    pool_size=20,
                    max_overflow=40,
                )
                logger.info("Connected to PostgreSQL")
            except Exception as e:
                AppState.postgres_engine = None
                logger.warning(f"PostgreSQL unavailable, continuing without it: {e}")
        elif db_url:
            logger.warning("SQLAlchemy not installed; PostgreSQL connection skipped")

        # MongoDB
        mongo_url = os.getenv("MONGODB_URL")
        if mongo_url and motor_asyncio is not None:
            try:
                AppState.mongodb_client = motor_asyncio.AsyncClient(mongo_url)
                await AppState.mongodb_client.admin.command("ping")
                logger.info("Connected to MongoDB")
            except Exception as e:
                AppState.mongodb_client = None
                logger.warning(f"MongoDB unavailable, continuing without it: {e}")
        elif mongo_url:
            logger.warning("Motor not installed; MongoDB connection skipped")

        # Redis
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        if redis is not None:
            try:
                AppState.redis_client = await redis.from_url(redis_url)
                await AppState.redis_client.ping()
                logger.info("Connected to Redis")
            except Exception as e:
                AppState.redis_client = None
                logger.warning(f"Redis unavailable, continuing without it: {e}")
        else:
            logger.warning("Redis package not installed; Redis connection skipped")

        logger.info("Axiom Credit API started successfully")

    except Exception as e:
        logger.error(f"Error during startup: {e}")
        raise

    yield

    # ===== SHUTDOWN =====
    logger.info("Shutting down Axiom Credit API")

    if AppState.postgres_engine:
        await AppState.postgres_engine.dispose()
        logger.info("Closed PostgreSQL connection")

    if AppState.mongodb_client:
        AppState.mongodb_client.close()
        logger.info("Closed MongoDB connection")

    if AppState.redis_client:
        await AppState.redis_client.close()
        logger.info("Closed Redis connection")


def create_app() -> FastAPI:
    """
    Create and configure FastAPI application.

    Returns:
        Configured FastAPI instance
    """
    # Create app with lifespan
    app = FastAPI(
        title="Axiom Credit Platform",
        description="Production-grade credit scoring for thin-file users in India",
        version="1.0.0",
        lifespan=lifespan,
    )

    # ===== MIDDLEWARE =====

    # CORS middleware
    allowed_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    ).split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Request ID middleware for tracking
    @app.middleware("http")
    async def add_request_id(request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(datetime.utcnow().timestamp()))
        request.state.request_id = request_id
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

    # Request logging middleware
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        logger.info(f"{request.method} {request.url.path}")
        response = await call_next(request)
        logger.info(f"{request.method} {request.url.path} - {response.status_code}")
        return response

    # ===== ROUTES =====

    # Health check endpoint
    @app.get("/health", response_model=HealthResponse)
    async def health_check():
        """
        Check API and dependency health.

        Returns:
            HealthResponse with status of all components
        """
        components = {
            "api": "ok",
            "postgres": "ok",
            "mongodb": "ok",
            "redis": "ok",
        }

        # Check PostgreSQL
        if AppState.postgres_engine:
            try:
                async with AppState.postgres_engine.connect() as conn:
                    await conn.execute("SELECT 1")
            except Exception as e:
                logger.warning(f"PostgreSQL health check failed: {e}")
                components["postgres"] = "degraded"
        else:
            components["postgres"] = "not_configured"

        # Check MongoDB
        if AppState.mongodb_client:
            try:
                await AppState.mongodb_client.admin.command("ping")
            except Exception as e:
                logger.warning(f"MongoDB health check failed: {e}")
                components["mongodb"] = "degraded"
        else:
            components["mongodb"] = "not_configured"

        # Check Redis
        if AppState.redis_client:
            try:
                await AppState.redis_client.ping()
            except Exception as e:
                logger.warning(f"Redis health check failed: {e}")
                components["redis"] = "degraded"
        else:
            components["redis"] = "not_configured"

        # Determine overall status
        status_value = (
            "healthy" if all(v == "ok" for v in components.values()) else "degraded"
        )

        return HealthResponse(
            status=status_value,
            timestamp=datetime.utcnow(),
            components=components,
        )

    # ===== IMPORT ROUTES =====
    from .routes import score, verify

    app.include_router(score.router, prefix="/v1", tags=["scoring"])
    app.include_router(verify.router, prefix="/v1", tags=["verification"])

    logger.info("FastAPI application created successfully")

    return app


# Create app instance
app = create_app()


# Entry point for uvicorn
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "False").lower() == "true",
    )
