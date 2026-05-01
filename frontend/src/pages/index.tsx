import NextLink from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TopNav } from "@/components/TopNav";

const MotionBox = motion(Box);

const featureCards = [
  {
    title: "Real Data",
    text: "Aggregate alternative behavioral signals from UPI and account activity.",
  },
  {
    title: "AI Analysis",
    text: "Run the scoring engine with explainability and risk-aware interpretation.",
  },
  {
    title: "Trust Score",
    text: "Generate a clean trust outcome with confidence and verification status.",
  },
  {
    title: "Better Access",
    text: "Present user-ready intelligence for lenders, landlords, and fintech teams.",
  },
];

export default function Home() {
  const { scrollYProgress } = useScroll();

  const yCard = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yHand = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const cardLift = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.06]);

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />

      <Grid templateColumns={["1fr", null, "1.15fr 0.85fr"]} gap={[8, 10]} alignItems="stretch">
        <GridItem>
          <Box
            p={[6, 8]}
            borderWidth="1px"
            borderRadius="34px"
            bg="rgba(16, 18, 24, 0.9)"
            minH="100%"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              inset="auto -80px -80px auto"
              w="280px"
              h="280px"
              borderRadius="full"
              bg="radial-gradient(circle, rgba(246,196,90,0.32) 0%, rgba(246,196,90,0) 70%)"
            />
            <VStack align="stretch" spacing={7} position="relative">
              <Text color="#f6c45a" letterSpacing="0.18em" fontSize="xs">
                01. LANDING PAGE
              </Text>

              <Box>
                <Text
                  fontSize={["4xl", "5xl", "6xl"]}
                  lineHeight="1.05"
                  fontWeight="bold"
                  maxW="720px"
                >
                  AI Credit Intelligence for the{" "}
                  <Text as="span" color="#f6c45a">
                    Invisible Economy
                  </Text>
                </Text>
                <Text color="#c7b894" mt={5} maxW="620px" fontSize="lg">
                  Axiom turns behavioral finance signals into explainable trust
                  scores with the same backend you already built.
                </Text>
              </Box>

              <HStack spacing={4} flexWrap="wrap">
                <Button
                  as={NextLink}
                  href="/evaluate"
                  h="56px"
                  px={8}
                  borderRadius="18px"
                  bg="#f6c45a"
                  color="#17130b"
                  _hover={{ bg: "#ffd67d" }}
                >
                  Run Evaluation
                </Button>
                <Button
                  as={NextLink}
                  href="/dashboard"
                  variant="outline"
                  h="56px"
                  px={8}
                  borderRadius="18px"
                  borderColor="rgba(246,196,90,0.4)"
                  color="#f6ead1"
                  _hover={{ bg: "rgba(246,196,90,0.08)" }}
                >
                  View Demo
                </Button>
              </HStack>

              <SimpleGrid columns={[1, 2, 4]} spacing={4}>
                {featureCards.map((card) => (
                  <Box
                    key={card.title}
                    p={4}
                    borderWidth="1px"
                    borderRadius="18px"
                    bg="rgba(255,255,255,0.02)"
                  >
                    <Text fontWeight="bold" mb={2}>
                      {card.title}
                    </Text>
                    <Text color="#a99972" fontSize="sm">
                      {card.text}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <VStack spacing={6} align="stretch">
            <Box
              p={[6, 7]}
              borderWidth="1px"
              borderRadius="30px"
              bg="#020202"
              minH="280px"
              position="relative"
              overflow="hidden"
            >
              <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={4}>
                AXIOM VISUAL ENGINE
              </Text>
              <Flex justify="center" align="center" py={2} minH="320px" position="relative">
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
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    priority
                  />

                  <MotionBox
                    position="absolute"
                    top="45%"
                    right="15%"
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
                    top="42%"
                    right="13%"
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
                        transform: "perspective(900px) rotate(-18deg) rotateX(16deg) rotateY(-12deg)",
                        transformOrigin: "bottom left",
                      }}
                    />
                  </MotionBox>
                </MotionBox>
              </Flex>
              <Text color="#b7ab8b" textAlign="center">
                Hand and card now use the scroll animation logic you shared.
              </Text>
            </Box>

            <Box
              p={[5, 6]}
              borderWidth="1px"
              borderRadius="30px"
              bg="rgba(16, 18, 24, 0.9)"
            >
              <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={4}>
                PIPELINE PREVIEW
              </Text>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text mb={2}>Collecting Data</Text>
                  <Progress value={100} size="sm" borderRadius="full" />
                </Box>
                <Box>
                  <Text mb={2}>Building Trust Graph</Text>
                  <Progress value={84} size="sm" borderRadius="full" />
                </Box>
                <Box>
                  <Text mb={2}>Generating Score</Text>
                  <Progress value={72} size="sm" borderRadius="full" />
                </Box>
              </VStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
}
