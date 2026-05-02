import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getLatestScore, getScoreHistory, ScoreHistoryEntry } from "@/lib/storage";

type ResultOverviewProps = {
  showExplanation?: boolean;
};

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
    return {
      label: "High Density",
      ringSize: "78px",
      ringTone: "rgba(104,3,14,0.18)",
      centerSize: "26px",
      centerTone: "#1b1410",
      withGrid: true,
      accentGlow:
        "radial-gradient(circle, rgba(242,158,8,0.28) 0%, rgba(226,89,5,0.14) 34%, rgba(104,3,14,0.05) 58%, rgba(0,0,0,0) 76%)",
      description: "Dense trusted activity cluster with a strong local network signal.",
    };
  }

  if (score >= 650) {
    return {
      label: "Medium Density",
      ringSize: "92px",
      ringTone: "rgba(226,89,5,0.14)",
      centerSize: "20px",
      centerTone: "#5e260d",
      withGrid: false,
      accentGlow:
        "radial-gradient(circle, rgba(242,158,8,0.22) 0%, rgba(226,89,5,0.10) 42%, rgba(0,0,0,0) 74%)",
      description: "Balanced local trust activity with moderate transaction concentration.",
    };
  }

  return {
    label: "Low Density",
    ringSize: "114px",
    ringTone: "rgba(201,0,0,0.12)",
    centerSize: "16px",
    centerTone: "#f6d1ba",
    withGrid: false,
    accentGlow:
      "radial-gradient(circle, rgba(201,0,0,0.18) 0%, rgba(226,89,5,0.08) 38%, rgba(0,0,0,0) 74%)",
    description: "Sparse trust activity with lighter surrounding neighborhood strength.",
  };
}

export function ResultOverview({ showExplanation = true }: ResultOverviewProps) {
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
  const reasonCodes = latest?.behavioral_drivers ?? [];
  const tierColor = getTierColor(tier);
  const neighborhoodDensity = useMemo(() => getNeighborhoodDensity(score), [score]);

  const positiveFactors = useMemo(() => {
    const positives = reasonCodes
      .filter((item) => item.direction === "positive")
      .map((item) => item.driver);

    return positives.length
      ? positives
      : [
          "Stable income pattern",
          "On-time payment consistency",
          "Low volatility in essential spends",
          "Strong repayment reliability",
        ];
  }, [reasonCodes]);

  const negativeFactors = useMemo(() => {
    const negatives = reasonCodes
      .filter((item) => item.direction === "negative")
      .map((item) => item.driver);

    return negatives.length
      ? negatives
      : [
          "Short behavioral history",
          "Moderate savings variability",
          "Some cash-heavy periods",
          "Thin formal credit depth",
        ];
  }, [reasonCodes]);

  return (
    <VStack spacing={8} align="stretch">
      {!history.length && (
        <Alert borderRadius="18px" bg="rgba(242, 158, 8, 0.16)" color="#3b2415">
          <AlertIcon />
          No live score found yet. Run an evaluation from the landing page to populate this result view.
        </Alert>
      )}

      <Box
        p={[7, 9]}
        borderWidth="1px"
        borderRadius="34px"
        bg="linear-gradient(180deg, rgba(255,250,241,0.98) 0%, rgba(248,240,229,0.98) 100%)"
        boxShadow="0 28px 70px rgba(104, 3, 14, 0.08)"
      >
        <Text color="#980002" fontSize="sm" letterSpacing="0.18em" mb={6}>
          VOUCH TRUST SCORE
        </Text>
        <VStack spacing={6} align="center">
          <Text color="#8f6f54" fontSize="sm" letterSpacing="0.16em" textAlign="center">
            LIVE TRUST OUTCOME
          </Text>
          <Flex justify="center" w="100%">
            <Box
              w={["280px", "360px", "430px"]}
              h={["280px", "360px", "430px"]}
              borderRadius="full"
              border="24px solid rgba(104,3,14,0.08)"
              borderTopColor={tierColor}
              borderRightColor={tierColor}
              boxShadow="0 0 0 14px rgba(242,158,8,0.08)"
              position="relative"
              bg="rgba(255,255,255,0.72)"
            >
              <Flex position="absolute" inset="0" align="center" justify="center" direction="column">
                <Text fontSize={["6xl", "8xl", "9xl"]} fontWeight="900" lineHeight="0.95" color="#231911">
                  {score}
                </Text>
                <Text color={tierColor} fontWeight="bold" letterSpacing="0.16em" fontSize={["md", "lg"]}>
                  {tier.toUpperCase()}
                </Text>
              </Flex>
            </Box>
          </Flex>
          <Text color="#6f5242" maxW="520px" textAlign="center">
            Vouch translates behavioral finance signals into a trust score that is easy to understand and ready to act on.
          </Text>
        </VStack>
      </Box>

      <Grid templateColumns={["1fr", null, "1.05fr 0.95fr"]} gap={8}>
        <GridItem>
          <VStack spacing={4} align="stretch">
            <Box p={[6, 8]} borderWidth="1px" borderRadius="30px" bg="rgba(255,250,241,0.96)" boxShadow="0 18px 34px rgba(104, 3, 14, 0.05)">
              <Text color="#980002" fontSize="sm" letterSpacing="0.14em" mb={5}>
                RESULT DETAILS
              </Text>
              <Grid templateColumns={["1fr", null, "1fr 1fr"]} gap={4}>
                <Box p={5} borderWidth="1px" borderRadius="22px" bg="rgba(242,158,8,0.08)">
                  <Text color="#8f6f54" fontSize="sm">
                    Vouch Score
                  </Text>
                  <Text mt={2} fontSize="3xl" fontWeight="bold" color="#231911">
                    {score}
                  </Text>
                </Box>
                <Box p={5} borderWidth="1px" borderRadius="22px" bg="rgba(226,89,5,0.08)">
                  <Text color="#8f6f54" fontSize="sm">
                    Credit Tier
                  </Text>
                  <Text mt={2} fontSize="3xl" fontWeight="bold" color={tierColor}>
                    {tier}
                  </Text>
                </Box>
                <Box p={5} borderWidth="1px" borderRadius="22px" bg="rgba(201,0,0,0.06)">
                  <Text color="#8f6f54" fontSize="sm">
                    Confidence Score
                  </Text>
                  <Text mt={2} fontSize="3xl" fontWeight="bold" color="#231911">
                    {confidence.toFixed(2)}
                  </Text>
                </Box>
                <Box p={5} borderWidth="1px" borderRadius="22px" bg="rgba(242,158,8,0.06)">
                  <Text color="#8f6f54" fontSize="sm">
                    Verification
                  </Text>
                  <Text mt={2} fontSize="xl" fontWeight="bold" color="#231911">
                    {verificationStatus}
                  </Text>
                </Box>
              </Grid>
            </Box>

            {showExplanation && (
              <Box p={[6, 8]} borderWidth="1px" borderRadius="30px" bg="rgba(255,250,241,0.96)" boxShadow="0 18px 34px rgba(104, 3, 14, 0.05)">
                <Text color="#980002" fontSize="sm" letterSpacing="0.14em" mb={5}>
                  EXPLANATION
                </Text>
                <Grid templateColumns={["1fr", null, "1fr 1fr"]} gap={6}>
                  <GridItem>
                    <Box p={5} borderWidth="1px" borderRadius="22px" h="100%" bg="rgba(242,158,8,0.06)">
                      <Text fontSize="xl" fontWeight="bold" mb={4} color="#231911">
                        Positive Factors
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        {positiveFactors.map((factor) => (
                          <HStack key={factor} align="flex-start">
                            <Box mt={1} w="10px" h="10px" borderRadius="full" bg="#EC8805" />
                            <Text color="#3c2d23">{factor}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={5} borderWidth="1px" borderRadius="22px" h="100%" bg="rgba(152,0,2,0.05)">
                      <Text fontSize="xl" fontWeight="bold" mb={4} color="#231911">
                        Negative Factors
                      </Text>
                      <VStack align="stretch" spacing={3}>
                        {negativeFactors.map((factor) => (
                          <HStack key={factor} align="flex-start">
                            <Box mt={1} w="10px" h="10px" borderRadius="full" bg="#C90000" />
                            <Text color="#3c2d23">{factor}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>
            )}
          </VStack>
        </GridItem>

        <GridItem>
          <VStack spacing={4} align="stretch">
            <Box p={5} borderWidth="1px" borderRadius="24px" bg="rgba(255,250,241,0.96)" boxShadow="0 16px 30px rgba(104, 3, 14, 0.05)">
              <Text color="#8f6f54" fontSize="sm">
                Signal Count
              </Text>
              <Text mt={2} fontSize="2xl" fontWeight="bold" color="#231911">
                {signalCount}
              </Text>
            </Box>

            <Box p={5} borderWidth="1px" borderRadius="24px" bg="rgba(255,250,241,0.96)" boxShadow="0 16px 30px rgba(104, 3, 14, 0.05)">
              <Text color="#8f6f54" fontSize="sm" mb={4}>
                Neighborhood Density
              </Text>
              <Box
                position="relative"
                h="230px"
                borderWidth="1px"
                borderRadius="24px"
                overflow="hidden"
                bg={neighborhoodDensity.withGrid
                  ? "linear-gradient(rgba(226,89,5,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(242,158,8,0.10) 1px, transparent 1px), linear-gradient(180deg, rgba(255,244,214,0.95) 0%, rgba(255,239,210,0.95) 100%)"
                  : "linear-gradient(180deg, rgba(255,248,233,0.96) 0%, rgba(252,238,214,0.96) 100%)"}
                backgroundSize={neighborhoodDensity.withGrid ? "24px 24px, 24px 24px, auto" : "auto"}
              >
                <Box position="absolute" inset="0" bg={neighborhoodDensity.accentGlow} />
                <Box position="absolute" top="22px" left="24px" w="12px" h="12px" borderRadius="full" bg="#E25905" />
                <Box position="absolute" top="48px" right="48px" w="10px" h="10px" borderRadius="full" bg="#980002" />
                <Box position="absolute" bottom="32px" right="42px" w="16px" h="16px" borderRadius="full" bg="#F29E08" />
                <Box position="absolute" bottom="42px" left="38px" w="8px" h="8px" borderRadius="full" bg="#C90000" />
                <Flex position="absolute" inset="0" align="center" justify="center">
                  <Box
                    w={neighborhoodDensity.ringSize}
                    h={neighborhoodDensity.ringSize}
                    borderRadius="full"
                    bg={neighborhoodDensity.ringTone}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow={neighborhoodDensity.withGrid ? "0 0 0 14px rgba(242,158,8,0.08)" : "0 0 0 10px rgba(226,89,5,0.06)"}
                  >
                    <Box
                      w={neighborhoodDensity.centerSize}
                      h={neighborhoodDensity.centerSize}
                      borderRadius="full"
                      bg={neighborhoodDensity.centerTone}
                    />
                  </Box>
                </Flex>
              </Box>
              <Text mt={4} fontWeight="bold" color="#231911">
                {neighborhoodDensity.label}
              </Text>
              <Text mt={1} color="#6f5242" fontSize="sm">
                {neighborhoodDensity.description}
              </Text>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      <Flex justify="center">
        <Button
          as={NextLink}
          href="/more-info"
          h="58px"
          px={10}
          borderRadius="999px"
          bg="#F29E08"
          color="#2a1608"
          fontWeight="bold"
          _hover={{ bg: "#EC8805" }}
        >
          More Info
        </Button>
      </Flex>
    </VStack>
  );
}
