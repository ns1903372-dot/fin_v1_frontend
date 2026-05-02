import { Box, Button, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useThemeMode } from "@/components/theme-mode";

export function TopNav() {
  const { mode, palette, toggleMode } = useThemeMode();

  return (
    <Box
      mb={8}
      px={[4, 6]}
      py={4}
      borderWidth="1px"
      borderColor={palette.navBorder}
      borderRadius="24px"
      bg={palette.navBg}
      boxShadow={palette.navShadow}
      backdropFilter="blur(10px)"
    >
      <HStack spacing={6} align="center" justify="space-between" flexWrap="wrap">
        <Text fontWeight="bold" fontSize="xl" letterSpacing="0.16em" color={palette.navAccent}>
          VOUCH
        </Text>
        <HStack spacing={[3, 5]} color={palette.navText} flexWrap="wrap">
          <Link as={NextLink} href="/" _hover={{ color: palette.accentSoft }}>
            Home
          </Link>
          <Link as={NextLink} href="/landing" _hover={{ color: palette.accentSoft }}>
            Landing
          </Link>
          <Link as={NextLink} href="/evaluate" _hover={{ color: palette.accentSoft }}>
            Result
          </Link>
          <Link as={NextLink} href="/more-info" _hover={{ color: palette.accentSoft }}>
            More Info
          </Link>
        </HStack>
        <HStack spacing={3}>
          <Button
            type="button"
            size="sm"
            variant="outline"
            borderRadius="999px"
            borderColor={palette.inputBorder}
            color={palette.navText}
            bg="transparent"
            _hover={{ borderColor: palette.accent, color: palette.navAccent }}
            onClick={toggleMode}
          >
            {mode === "light" ? "Dark Theme" : "Light Theme"}
          </Button>
          <Button
            as={NextLink}
            href="/landing"
            size="sm"
            bg={palette.buttonBg}
            color={palette.buttonText}
            borderRadius="999px"
            _hover={{ bg: palette.buttonHover }}
          >
            Get Started
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
}
