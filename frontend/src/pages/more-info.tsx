import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { TopNav } from "@/components/TopNav";
import { getLatestScore, ScoreHistoryEntry } from "@/lib/storage";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getTierColor(tier: string) {
  const normalizedTier = tier.toLowerCase();

  if (normalizedTier === "prime" || normalizedTier === "high") {
    return "#980002";
  }
  if (normalizedTier === "medium") {
    return "#E25905";
  }
  return "#C90000";
}

function getNeighborhoodDensity(score: number) {
  if (score >= 760) {
    return "High Density";
  }
  if (score >= 650) {
    return "Medium Density";
  }
  return "Low Density";
}

function DetailCard({
  title,
  children,
  accent = "#F29E08",
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <Box
      p={[5, 6]}
      borderWidth="1px"
      borderRadius="28px"
      bg="rgba(255,250,241,0.98)"
      boxShadow="0 16px 28px rgba(104, 3, 14, 0.05)"
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" left="0" top="0" bottom="0" w="6px" bg={accent} />
      <Text fontSize="2xl" fontWeight="bold" color="#231911" mb={4}>
        {title}
      </Text>
      {children}
    </Box>
  );
}

export default function MoreInfoPage() {
  const [latest, setLatest] = useState<ScoreHistoryEntry | null>(null);

  useEffect(() => {
    setLatest(getLatestScore());
  }, []);

  const score = latest?.axiom_score ?? 742;
  const confidence = latest?.confidence_interval ?? 0.87;
  const signalCount = latest?.signal_count ?? 12;
  const tier = latest?.tier ?? "High";
  const reasonCodes = latest?.behavioral_drivers ?? [];
  const tierColor = getTierColor(tier);
  const neighborhoodDensity = getNeighborhoodDensity(score);

  const scoreReasons = useMemo(() => {
    if (reasonCodes.length) {
      return reasonCodes.map((item) => ({
        title: item.driver,
        detail: `${item.direction === "positive" ? "Positive" : "Negative"} impact of ${Math.abs(item.impact_points)} points on the score.`,
      }));
    }

    return [
      {
        title: "Stable income rhythm",
        detail: "Consistent incoming patterns are lifting trust and reducing perceived repayment volatility.",
      },
      {
        title: "Repayment reliability",
        detail: "Regular payment behavior increases confidence that future obligations can be handled on time.",
      },
      {
        title: "Limited behavioral gaps",
        detail: "The current profile shows fewer major disruptions than lower-trust users, which supports a stronger result.",
      },
    ];
  }, [reasonCodes]);

  const highWeightFlags = useMemo(() => {
    const positive = reasonCodes
      .filter((item) => item.direction === "positive")
      .sort((a, b) => Math.abs(b.impact_points) - Math.abs(a.impact_points))
      .slice(0, 3)
      .map((item) => `${item.driver} (+${Math.abs(item.impact_points)} pts)`);

    if (positive.length) {
      return positive;
    }

    return [
      "Stable cashflow behavior",
      "Strong payment continuity",
      "Healthy trust-supporting transaction history",
    ];
  }, [reasonCodes]);

  const transactionInsights = useMemo(() => {
    const estimatedDigital = clamp(Math.round(signalCount * 2.5), 12, 48);
    const estimatedRecurring = clamp(Math.round(confidence * 18), 6, 18);

    return [
      `Most frequent transaction pattern: merchant and bill-pay style transfers with an estimated ${estimatedDigital} tracked repeats.`,
      `Recurring trust-supporting activity: roughly ${estimatedRecurring} stable monthly behaviors are reinforcing the score.`,
      "Transaction behavior appears more structured than erratic, which helps Vouch score predictability higher.",
    ];
  }, [confidence, signalCount]);

  const aiRecommendations = useMemo(() => {
    if (score >= 760) {
      return [
        "Maintain your current repayment rhythm and preserve the same verified payment consistency.",
        "Avoid sudden utilization spikes so the high-density trust profile stays stable.",
        "Keep verification records fresh to protect your premium Vouch position.",
      ];
    }

    if (score >= 650) {
      return [
        "Build more recurring verified payments to push the score upward in the next cycle.",
        "Improve savings stability and reduce irregular cash-heavy transaction periods.",
        "Use documented digital payment channels more often to strengthen neighborhood trust density.",
      ];
    }

    return [
      "Avoid heavy new credit until transaction behavior becomes more stable and better documented.",
      "Focus on consistent verified payments across the next few cycles before seeking larger products.",
      "Reduce risk-heavy spikes and increase steady digital activity to rebuild local trust density.",
    ];
  }, [score]);

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />
      <VStack spacing={8} align="stretch">
        {!latest && (
          <Alert borderRadius="18px" bg="rgba(242, 158, 8, 0.16)" color="#3b2415">
            <AlertIcon />
            No live score found yet. Run an evaluation first, then open More Info to see detailed score intelligence.
          </Alert>
        )}

        <Grid templateColumns={["1fr", null, "0.78fr 1.22fr"]} gap={[6, 8]} alignItems="start">
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Box
                p={[6, 7]}
                borderWidth="1px"
                borderRadius="32px"
                bg="rgba(255,250,241,0.98)"
                boxShadow="0 18px 34px rgba(104, 3, 14, 0.06)"
              >
                <Box
                  position="relative"
                  h="200px"
                  borderRadius="28px"
                  bg="linear-gradient(135deg, rgba(242,158,8,0.18) 0%, rgba(226,89,5,0.10) 50%, rgba(152,0,2,0.08) 100%)"
                  overflow="hidden"
                  mb={5}
                >
                  <Box position="absolute" top="18px" left="18px" w="78px" h="78px" borderRadius="24px" bg="#F29E08" />
                  <Box position="absolute" top="18px" right="18px" w="78px" h="78px" borderRadius="24px" bg="#EC8805" />
                  <Box position="absolute" bottom="18px" left="18px" w="78px" h="78px" borderRadius="24px" bg="#E25905" />
                  <Box position="absolute" bottom="18px" right="18px" w="78px" h="78px" borderRadius="24px" bg="#980002" />
                  <Flex position="absolute" inset="0" align="center" justify="center">
                    <Box
                      w="170px"
                      h="170px"
                      borderRadius="full"
                      border="16px solid rgba(104,3,14,0.08)"
                      borderTopColor={tierColor}
                      borderRightColor={tierColor}
                      bg="rgba(255,255,255,0.68)"
                    >
                      <Flex h="100%" align="center" justify="center" direction="column">
                        <Text fontSize="4xl" fontWeight="900" lineHeight="0.95" color="#231911">
                          {score}
                        </Text>
                        <Text color={tierColor} fontWeight="bold" fontSize="sm" letterSpacing="0.14em">
                          {tier.toUpperCase()}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>

                <Text fontSize="4xl" fontWeight="900" lineHeight="0.95" color="#231911">
                  More Info
                </Text>
                <Text mt={3} color="#6f5242">
                  A deeper Vouch explanation of score drivers, local trust density, transaction patterns, and what to do next.
                </Text>
              </Box>

              <DetailCard title="Score Snapshot" accent="#F29E08">
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text color="#8f6f54" fontSize="sm">Vouch Score</Text>
                    <Text mt={1} fontSize="3xl" fontWeight="bold" color="#231911">{score}</Text>
                  </Box>
                  <Box>
                    <Text color="#8f6f54" fontSize="sm">Credit Tier</Text>
                    <Text mt={1} fontSize="2xl" fontWeight="bold" color={tierColor}>{tier}</Text>
                  </Box>
                  <Box>
                    <Text color="#8f6f54" fontSize="sm">Confidence Score</Text>
                    <Text mt={1} fontSize="2xl" fontWeight="bold" color="#231911">{confidence.toFixed(2)}</Text>
                  </Box>
                  <Box>
                    <Text color="#8f6f54" fontSize="sm">Neighborhood Density</Text>
                    <Text mt={1} fontSize="2xl" fontWeight="bold" color="#231911">{neighborhoodDensity}</Text>
                  </Box>
                </VStack>
              </DetailCard>

              <DetailCard title="Signal Summary" accent="#E25905">
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text color="#8f6f54" fontSize="sm">Signal Count</Text>
                    <Text mt={1} fontSize="2xl" fontWeight="bold" color="#231911">{signalCount}</Text>
                  </Box>
                  <Box>
                    <Text color="#8f6f54" fontSize="sm">Trust Note</Text>
                    <Text mt={2} color="#6f5242">
                      Higher Vouch scores naturally align with denser surrounding neighborhood trust activity.
                    </Text>
                  </Box>
                </VStack>
              </DetailCard>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack spacing={6} align="stretch">
              <DetailCard title="Reasons Inducing The Score" accent="#980002">
                <VStack align="stretch" spacing={4}>
                  {scoreReasons.map((item) => (
                    <Box key={item.title} p={4} borderWidth="1px" borderRadius="20px" bg="rgba(255,255,255,0.62)">
                      <Text fontWeight="bold" color="#231911">{item.title}</Text>
                      <Text mt={2} color="#6f5242">{item.detail}</Text>
                    </Box>
                  ))}
                </VStack>
              </DetailCard>

              <DetailCard title="High Weightage Flags" accent="#C90000">
                <VStack align="stretch" spacing={3}>
                  {highWeightFlags.map((flag) => (
                    <HStack key={flag} align="flex-start">
                      <Box mt={1} w="10px" h="10px" borderRadius="full" bg="#C90000" />
                      <Text color="#3c2d23">{flag}</Text>
                    </HStack>
                  ))}
                </VStack>
              </DetailCard>

              <DetailCard title="Most Frequent Transaction" accent="#EC8805">
                <VStack align="stretch" spacing={3}>
                  {transactionInsights.map((item) => (
                    <HStack key={item} align="flex-start">
                      <Box mt={1} w="10px" h="10px" borderRadius="full" bg="#EC8805" />
                      <Text color="#3c2d23">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </DetailCard>

              <Box
                p={[6, 7]}
                borderWidth="1px"
                borderRadius="30px"
                bg="linear-gradient(135deg, rgba(242,158,8,0.18) 0%, rgba(226,89,5,0.14) 46%, rgba(152,0,2,0.12) 100%)"
                boxShadow="0 22px 38px rgba(226, 89, 5, 0.10)"
                position="relative"
                overflow="hidden"
              >
                <Box position="absolute" top="-32px" right="-24px" w="140px" h="140px" borderRadius="full" bg="rgba(255,255,255,0.18)" />
                <Text color="#68030E" fontSize="sm" letterSpacing="0.16em" mb={4} fontWeight="bold">
                  AI RECOMMENDATION TO IMPROVE YOUR VOUCH SCORE
                </Text>
                <VStack align="stretch" spacing={3} position="relative">
                  {aiRecommendations.map((item) => (
                    <HStack key={item} align="flex-start" p={3} borderRadius="18px" bg="rgba(255,250,241,0.72)">
                      <Box mt={1} w="10px" h="10px" borderRadius="full" bg="#F29E08" />
                      <Text color="#2f1d14" fontWeight="medium">{item}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>

        <Flex justify="center">
          <Button
            as={NextLink}
            href="/landing"
            h="56px"
            px={9}
            borderRadius="999px"
            bg="#F29E08"
            color="#2a1608"
            fontWeight="bold"
            _hover={{ bg: "#EC8805" }}
          >
            Back To Landing Page
          </Button>
        </Flex>
      </VStack>
    </Container>
  );
}
