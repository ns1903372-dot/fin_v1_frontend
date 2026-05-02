import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Box, Button, Container, Input, Text, VStack } from "@chakra-ui/react";
import { TopNav } from "@/components/TopNav";
import { useThemeMode } from "@/components/theme-mode";

export default function Home() {
  const { palette, mode } = useThemeMode();
  const { scrollYProgress } = useScroll();
  const [userId, setUserId] = useState("");

  const rawYCard = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const yCard = useSpring(rawYCard, { stiffness: 70, damping: 18 });

  const rawRotateCard = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const rotateCard = useSpring(rawRotateCard, { stiffness: 60, damping: 20 });

  const rawYHand = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yHand = useSpring(rawYHand, { stiffness: 50, damping: 25 });

  const rawRotateHand = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const rotateHand = useSpring(rawRotateHand, { stiffness: 50, damping: 25 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), {
    stiffness: 100,
    damping: 20,
  });

  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedUserId = window.localStorage.getItem("vouch_user_id");
    if (savedUserId) {
      setUserId(savedUserId);
    }
  }, []);

  function handleGetStarted() {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("vouch_user_id", userId.trim());
    }
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />

      <Box
        position="relative"
        overflow="hidden"
        borderWidth="1px"
        borderRadius="34px"
        bg={palette.cardBg}
        boxShadow={palette.cardShadow}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Box
          position="absolute"
          top={mode === "dark" ? "22%" : "28%"}
          right={mode === "dark" ? "16%" : "20%"}
          w={["360px", "520px", "700px"]}
          h={["360px", "520px", "700px"]}
          borderRadius="full"
          bg={palette.heroGlow}
          filter="blur(28px)"
          opacity={mode === "dark" ? 1 : 0.95}
        />

        <Box minH="200vh" position="relative">
          <Box position="sticky" top="0" h="100vh" display="flex" alignItems="center" justifyContent="center">
            <VStack
              position="absolute"
              left={["24px", "48px", "80px"]}
              maxW="520px"
              align="flex-start"
              spacing={5}
              zIndex={10}
            >
              <Text color={palette.accent} letterSpacing="0.18em" fontSize="xs">
                VOUCH PLATFORM
              </Text>
              <Text fontSize={["4xl", "5xl", "6xl"]} lineHeight="1.02" fontWeight="bold" color={palette.pageText}>
                Smarter Trust Scoring for the{" "}
                <Text as="span" color={palette.accentSoft}>
                  Invisible Economy
                </Text>
              </Text>
              <Text color={palette.mutedText} fontSize="lg" maxW="460px">
                Analyze behavior, detect fraud, and build trust instantly with a smoother Vouch experience across every page.
              </Text>

              <Box w="100%" maxW="420px">
                <Text color={palette.pageText} mb={3} fontWeight="semibold">
                  User ID
                </Text>
                <Input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="user_123_abc"
                  h="56px"
                  borderRadius="18px"
                  bg={palette.inputBg}
                  color={palette.inputText}
                  borderColor={palette.inputBorder}
                  _placeholder={{ color: palette.mutedText }}
                />
              </Box>

              <Button
                as={NextLink}
                href="/landing"
                onClick={handleGetStarted}
                h="58px"
                px={9}
                borderRadius="18px"
                bg={palette.buttonBg}
                color={palette.buttonText}
                _hover={{ bg: palette.buttonHover }}
              >
                Get Started
              </Button>
            </VStack>

            <Box
              position="absolute"
              right={["-8px", "20px", "70px"]}
              w={["360px", "500px", "620px"]}
              h={["360px", "500px", "620px"]}
              borderRadius="32px"
              bg={palette.heroStageBg}
              borderWidth="1px"
              borderColor={palette.inputBorder}
              overflow="hidden"
            >
              <motion.img
                src="/gold-hand-transparent.png"
                alt="Golden hand"
                style={{ y: yHand, rotate: rotateHand }}
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-0 bottom-0 w-[480px] md:w-[560px] lg:w-[620px]"
              />

              <motion.img
                src="/credit-card-transparent.png"
                alt="Credit card"
                style={{
                  y: yCard,
                  rotate: rotateCard,
                  rotateX,
                  rotateY,
                }}
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute right-[70px] top-[19%] w-[250px] md:w-[300px] lg:w-[340px] origin-bottom-left rotate-[12deg]"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
