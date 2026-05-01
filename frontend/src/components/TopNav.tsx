import { Box, Button, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export function TopNav() {
  return (
    <Box
      mb={8}
      px={[4, 6]}
      py={4}
      borderWidth="1px"
      borderColor="rgba(245, 195, 86, 0.18)"
      borderRadius="24px"
      bg="rgba(12, 15, 20, 0.9)"
      boxShadow="0 20px 60px rgba(0, 0, 0, 0.35)"
      backdropFilter="blur(12px)"
    >
      <HStack spacing={6} align="center" justify="space-between" flexWrap="wrap">
        <Text fontWeight="bold" fontSize="xl" letterSpacing="0.16em" color="#f6c45a">
          AXIOM
        </Text>
        <HStack spacing={[3, 5]} color="#dbc79d" flexWrap="wrap">
          <Link as={NextLink} href="/" _hover={{ color: "#f6c45a" }}>
            Home
          </Link>
          <Link as={NextLink} href="/evaluate" _hover={{ color: "#f6c45a" }}>
            Evaluate
          </Link>
          <Link as={NextLink} href="/dashboard" _hover={{ color: "#f6c45a" }}>
            Dashboard
          </Link>
          <Link as={NextLink} href="/verify" _hover={{ color: "#f6c45a" }}>
            Verify
          </Link>
        </HStack>
        <Button
          as={NextLink}
          href="/evaluate"
          size="sm"
          bg="#f6c45a"
          color="#14120d"
          _hover={{ bg: "#ffd67d" }}
        >
          Get Started
        </Button>
      </HStack>
    </Box>
  );
}
