# Start both Axiom backend and frontend
# Run this from the root axiom-test-main directory

Write-Host "Starting Axiom Backend and Frontend..."

# Check if Python is installed
$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Host "Python not found. Installing Python..."
  winget install --id Python.Python.3.11 -e --silent --accept-package-agreements --accept-source-agreements
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install Python."
    exit 1
  }
  Write-Host "Python installed."
}

# Install backend dependencies
Write-Host "Installing backend dependencies..."
pip install -e .
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to install backend dependencies."
  exit 1
}

# Start backend in background
Write-Host "Starting FastAPI backend..."
$backendJob = Start-Job -ScriptBlock {
  cd $using:PWD
  uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
}

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Start frontend
Write-Host "Starting Next.js frontend..."
cd frontend
.\start-frontend.ps1

# Wait for jobs
Wait-Job $backendJob
Receive-Job $backendJob