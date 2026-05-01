import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import Spline from "@splinetool/react-spline";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TopNav } from "@/components/TopNav";
import { getLatestScore, getScoreHistory, ScoreHistoryEntry } from "@/lib/storage";

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTierColor(tier: string) {
  if (tier.toLowerCase() === "prime") {
    return "#76d58b";
  }
  if (tier.toLowerCase() === "high") {
    return "#f6c45a";
  }
  if (tier.toLowerCase() === "medium") {
    return "#ffb86a";
  }
  return "#ff7b6b";
}

export default function DashboardPage() {
  const [latest, setLatest] = useState<ScoreHistoryEntry | null>(null);
  const [history, setHistory] = useState<ScoreHistoryEntry[]>([]);

  useEffect(() => {
    setLatest(getLatestScore());
    setHistory(getScoreHistory());
  }, []);

  const score = latest?.axiom_score ?? 742;
  const confidence = latest?.confidence_interval ?? 0.87;
  const tier = latest?.tier ?? "High";
  const verificationStatus = latest?.verification_status ?? "Bilateral Verified";
  const signalCount = latest?.signal_count ?? 12;
  const scoreBreakdown = useMemo(
    () => [
      { label: "Payment Behavior", value: clamp(Math.round(score / 8.4), 25, 98), tone: "#f6c45a" },
      { label: "Financial Stability", value: clamp(Math.round(confidence * 100) - 9, 18, 95), tone: "#e9c56d" },
      { label: "Social Trust", value: clamp(62 + signalCount, 20, 96), tone: "#9be17d" },
      { label: "Risk Factors", value: clamp(100 - Math.round(confidence * 70), 8, 55), tone: "#ff6f61" },
    ],
    [confidence, score, signalCount]
  );

  const chartData = useMemo(() => {
    const baseIncome = Math.round(score * 28);
    const baseExpense = Math.round(baseIncome * 0.58);

    return chartMonths.map((month, index) => ({
      month,
      income: baseIncome - 3200 + index * 1500 + (index % 2 === 0 ? 1800 : -400),
      expense: baseExpense - 1200 + index * 900 + (index % 3 === 0 ? -600 : 700),
    }));
  }, [score]);

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />
      <VStack spacing={8} align="stretch">
        <Box>
          <Text color="#f6c45a" letterSpacing="0.18em" fontSize="xs" mb={2}>
            04. DASHBOARD
          </Text>
          <Text fontSize={["3xl", "4xl"]} fontWeight="bold">
            Axiom Result Experience
          </Text>
          <Text color="#b7ab8b" mt={3} maxW="760px">
            This dashboard uses the backend score response and presents it in the
            same visual flow as your reference image.
          </Text>
        </Box>

        {!history.length && (
          <Alert borderRadius="18px" bg="rgba(245, 195, 86, 0.16)" color="#f6ead1">
            <AlertIcon />
            No live score has been generated yet, so this page is showing a styled
            demo state until you run an evaluation.
          </Alert>
        )}

        <Grid templateColumns={["1fr", null, "1.05fr 0.95fr"]} gap={8}>
          <GridItem>
            <Box
              p={[6, 8]}
              borderWidth="1px"
              borderRadius="30px"
              bg="rgba(16, 18, 24, 0.92)"
            >
              <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={5}>
                AXIOM TRUST SCORE
              </Text>
              <Flex
                direction={["column", "row"]}
                gap={8}
                align={["stretch", "center"]}
                justify="space-between"
              >
                <Flex justify="center" flex="0 0 240px">
                  <Box
                    w="220px"
                    h="220px"
                    borderRadius="full"
                    border="10px solid rgba(246,196,90,0.18)"
                    borderTopColor="#f6c45a"
                    borderRightColor="#f6c45a"
                    position="relative"
                  >
                    <Flex
                      position="absolute"
                      inset="0"
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Text fontSize="5xl" fontWeight="bold">
                        {score}
                      </Text>
                      <Text color={getTierColor(tier)} fontWeight="bold" letterSpacing="0.12em">
                        {tier.toUpperCase()}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>

                <VStack flex="1" spacing={4} align="stretch">
                  {scoreBreakdown.map((item) => (
                    <Box key={item.label}>
                      <Flex justify="space-between" mb={2}>
                        <Text>{item.label}</Text>
                        <Text color={item.tone} fontWeight="bold">
                          {item.value}
                        </Text>
                      </Flex>
                      <Box h="7px" borderRadius="full" bg="rgba(255,255,255,0.08)">
                        <Box
                          h="100%"
                          w={`${item.value}%`}
                          borderRadius="full"
                          bg={item.tone}
                        />
                      </Box>
                    </Box>
                  ))}

                  <SimpleGrid columns={[1, 2]} spacing={4} pt={2}>
                    <Box p={4} borderWidth="1px" borderRadius="18px">
                      <Text color="#a99972" fontSize="sm">
                        Verification
                      </Text>
                      <Text mt={1}>{verificationStatus}</Text>
                    </Box>
                    <Box p={4} borderWidth="1px" borderRadius="18px">
                      <Text color="#a99972" fontSize="sm">
                        Confidence
                      </Text>
                      <Text mt={1}>{confidence.toFixed(2)}</Text>
                    </Box>
                  </SimpleGrid>
                </VStack>
              </Flex>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              p={[6, 8]}
              borderWidth="1px"
              borderRadius="30px"
              bg="rgba(16, 18, 24, 0.92)"
              h="100%"
            >
              <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={5}>
                EXPLORE MORE
              </Text>
              <VStack align="stretch" spacing={5}>
                <Box p={6} borderWidth="1px" borderRadius="24px" bg="rgba(255,255,255,0.02)">
                  <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={2}>
                    05. TRUST GRAPH
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    Open Full Network View
                  </Text>
                  <Text color="#b7ab8b" mb={5}>
                    See the complete relationship graph on its own page from the dashboard.
                  </Text>
                  <Button
                    as={NextLink}
                    href="/graph"
                    bg="#f6c45a"
                    color="#17130b"
                    _hover={{ bg: "#ffd67d" }}
                  >
                    Open Graph Page
                  </Button>
                </Box>

                <Box p={6} borderWidth="1px" borderRadius="24px" bg="rgba(255,255,255,0.02)">
                  <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={2}>
                    06. EXPLAINABILITY
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    Open Full Explainability
                  </Text>
                  <Text color="#b7ab8b" mb={5}>
                    Review the full positive and negative factors on a dedicated page.
                  </Text>
                  <Button
                    as={NextLink}
                    href="/explainability"
                    variant="outline"
                    borderColor="rgba(246,196,90,0.4)"
                    color="#f6ead1"
                    _hover={{ bg: "rgba(246,196,90,0.08)" }}
                  >
                    Open Explainability Page
                  </Button>
                </Box>
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        <Grid templateColumns={["1fr", null, "1fr 0.95fr"]} gap={8}>
          <GridItem>
            <Box
              p={[6, 8]}
              borderWidth="1px"
              borderRadius="30px"
              bg="rgba(16, 18, 24, 0.92)"
            >
              <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={5}>
                INCOME VS EXPENSE
              </Text>
              <Box h="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="month" stroke="#8e866f" />
                    <YAxis stroke="#8e866f" />
                    <Tooltip
                      contentStyle={{
                        background: "#101218",
                        border: "1px solid rgba(246,196,90,0.2)",
                        color: "#f6ead1",
                      }}
                    />
                    <Line type="monotone" dataKey="income" stroke="#f6c45a" strokeWidth={3} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="expense" stroke="#b7b8bd" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>

          <GridItem>
            <Box
              p={[6, 8]}
              borderWidth="1px"
              borderRadius="30px"
              bg="rgba(16, 18, 24, 0.92)"
            >
              <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={5}>
                AI INSIGHTS
              </Text>
              <VStack align="stretch" spacing={4}>
                {[
                  `${tier} trust tier detected`,
                  `${signalCount} behavioral signals included`,
                  verificationStatus,
                  `${history.length || 1} recent score run available`,
                ].map((insight) => (
                  <HStack
                    key={insight}
                    p={4}
                    borderWidth="1px"
                    borderRadius="18px"
                    bg="rgba(255,255,255,0.02)"
                    align="flex-start"
                  >
                    <Box mt={1} w="10px" h="10px" borderRadius="full" bg="#7cd67b" />
                    <Text>{insight}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </GridItem>
        </Grid>

        <Box p={[6, 8]} borderWidth="1px" borderRadius="30px" bg="rgba(16, 18, 24, 0.92)">
          <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={5}>
            3D SCENE
          </Text>
          <Box
            h={["360px", "420px", "520px"]}
            borderWidth="1px"
            borderRadius="24px"
            overflow="hidden"
            bg="#050505"
          >
            <Spline scene="https://prod.spline.design/CCxvWVM0B1wGqJzX/scene.splinecode" />
          </Box>
        </Box>

        <Box p={[6, 8]} borderWidth="1px" borderRadius="30px" bg="rgba(16, 18, 24, 0.92)">
          <Text color="#f6c45a" fontSize="sm" letterSpacing="0.14em" mb={5}>
            CONFIDENCE
          </Text>
          <Box p={5} borderWidth="1px" borderRadius="22px">
            <Text mb={3}>Confidence Score</Text>
            <Box h="8px" borderRadius="full" bg="rgba(255,255,255,0.08)">
              <Box
                h="100%"
                w={`${Math.round(confidence * 100)}%`}
                borderRadius="full"
                bg="#f6c45a"
              />
            </Box>
            <Text mt={3} color="#b7ab8b">
              {confidence.toFixed(2)} high confidence in this assessment.
            </Text>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
