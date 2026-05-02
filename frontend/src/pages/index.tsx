import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Box, Button, Container, Flex, Grid, GridItem, Input, Text, VStack } from "@chakra-ui/react";
import { TopNav } from "@/components/TopNav";

const MotionBox = motion(Box);

export default function Home() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const [userId, setUserId] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const yHand = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const yCard = useTransform(scrollYProgress, [0, 1], [0, -112]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const cardLift = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.985, 1.018]);

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

    if (isNavigating) {
      return;
    }

    setIsNavigating(true);
    window.setTimeout(() => {
      router.push("/landing");
    }, 180);
  }

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />

      <Grid templateColumns={["1fr", null, "1.1fr 0.9fr"]} gap={[8, 10]} alignItems="stretch">
        <GridItem>
          <Box
            p={[7, 9]}
            borderWidth="1px"
            borderRadius="34px"
            bg="rgba(16, 18, 24, 0.92)"
            minH="100%"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              inset="auto -90px -90px auto"
              w="320px"
              h="320px"
              borderRadius="full"
              bg="radial-gradient(circle, rgba(246,196,90,0.24) 0%, rgba(246,196,90,0) 70%)"
            />
            <VStack align="stretch" spacing={7} position="relative">
              <Box>
                <Text fontSize={["4xl", "5xl", "6xl"]} lineHeight="1.02" fontWeight="bold" maxW="760px">
                  Build Trust Scores for the{" "}
                  <Text as="span" color="#f6c45a">
                    Invisible Economy
                  </Text>
                </Text>
                <Text color="#c7b894" mt={5} maxW="620px" fontSize="lg">
                  Start from a clean home page, then move into the real landing experience only when you click `Get Started`.
                </Text>
              </Box>
              <Box maxW="420px">
                <Text color="#e8d7ac" mb={3} fontWeight="semibold">
                  User ID
                </Text>
                <Input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="user_123_abc"
                  h="56px"
                  borderRadius="18px"
                  bg="rgba(10, 12, 16, 0.95)"
                  color="#f8eed7"
                  borderColor="rgba(246,196,90,0.22)"
                />
              </Box>
              <Button
                onClick={handleGetStarted}
                alignSelf="flex-start"
                h="58px"
                px={9}
                borderRadius="18px"
                bg="#f6c45a"
                color="#17130b"
                _hover={{ bg: "#ffd67d" }}
                isLoading={isNavigating}
                loadingText="Opening"
              >
                Get Started
              </Button>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            p={[7, 8]}
            borderWidth="1px"
            borderRadius="34px"
            bg="#020202"
            minH="100%"
            position="relative"
            overflow="hidden"
          >
            <Text color="#f6c45a" letterSpacing="0.18em" fontSize="xs" mb={4}>
              VOUCH VISUAL ENGINE
            </Text>
            <Flex justify="center" align="center" minH={["320px", "380px", "460px"]} position="relative">
              <Box
                position="absolute"
                inset="8% 8% 8% 8%"
                borderRadius="28px"
                bg="radial-gradient(circle at 62% 42%, rgba(255,186,64,0.08), transparent 24%), radial-gradient(circle at 38% 64%, rgba(255,224,149,0.06), transparent 28%), linear-gradient(180deg, rgba(8,8,8,0.82) 0%, rgba(1,1,1,0.96) 100%)"
              />

              <MotionBox
                position="relative"
                w="100%"
                maxW="430px"
                style={{ y: yHand, rotate }}
                zIndex={2}
                filter="drop-shadow(0 42px 48px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 24px rgba(246, 196, 90, 0.22))"
              >
                <Image
                  src="/gold-hand-transparent.png"
                  alt="Golden hand"
                  width={520}
                  height={420}
                  style={{ width: "100%", height: "auto", objectFit: "contain" }}
                  priority
                />

                <MotionBox
                  position="absolute"
                  top="43.5%"
                  right="14%"
                  w={["128px", "168px"]}
                  h={["88px", "112px"]}
                  zIndex={2}
                  borderRadius="24px"
                  bg="radial-gradient(circle at 35% 50%, rgba(246,196,90,0.24), rgba(246,196,90,0.02) 58%, rgba(0,0,0,0) 80%)"
                  filter="blur(12px)"
                  style={{ y: cardLift }}
                />

                <MotionBox
                  position="absolute"
                  top="41.5%"
                  right="13.5%"
                  w={["152px", "195px"]}
                  zIndex={3}
                  style={{ y: yCard, rotate, scale: cardScale }}
                  filter="drop-shadow(0 28px 42px rgba(0, 0, 0, 0.46)) drop-shadow(0 0 22px rgba(246, 196, 90, 0.22))"
                >
                  <Image
                    src="/credit-card-transparent.png"
                    alt="Credit card"
                    width={260}
                    height={180}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      transform: "perspective(900px) rotate(-14deg) rotateX(12deg) rotateY(-10deg)",
                      transformOrigin: "bottom left",
                    }}
                  />
                </MotionBox>
              </MotionBox>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
}
