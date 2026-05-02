import Spline from "@splinetool/react-spline";
import { Box, Container, Grid, GridItem, Text, VStack } from "@chakra-ui/react";
import { ScoreForm } from "@/components/ScoreForm";
import { TopNav } from "@/components/TopNav";
import { useThemeMode } from "@/components/theme-mode";

export default function LandingPage() {
  const { palette, mode } = useThemeMode();

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />

      <Grid mt={8} templateColumns={["1fr", null, "1.02fr 0.98fr"]} gap={[6, 8]} alignItems="stretch">
        <GridItem>
          <Box
            p={[6, 8]}
            borderWidth="1px"
            borderRadius="34px"
            bg={palette.cardBg}
            boxShadow={palette.cardShadow}
            position="relative"
            h="100%"
          >
            <VStack align="stretch" spacing={7} position="relative">
              <Text color={palette.accent} letterSpacing="0.18em" fontSize="xs">
                01. LANDING PAGE
              </Text>

              <Box>
                <Text fontSize={["4xl", "5xl", "6xl"]} lineHeight="1.05" fontWeight="bold" maxW="720px" color={palette.pageText}>
                  AI Credit Intelligence for the{" "}
                  <Text as="span" color={palette.accentSoft}>
                    Invisible Economy
                  </Text>
                </Text>
                <Text color={palette.mutedText} mt={5} maxW="620px" fontSize="lg">
                  Axiom turns behavioral finance signals into explainable trust scores with the same backend you already built.
                </Text>
              </Box>
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            p={[4, 5]}
            borderWidth="1px"
            borderRadius="34px"
            bg={palette.cardBg}
            boxShadow={palette.cardShadow}
            overflow="hidden"
            h="100%"
            minH={["340px", "380px", "420px"]}
            position="relative"
          >
            <Box
              h="100%"
              borderWidth="1px"
              borderRadius="26px"
              overflow="hidden"
              bg={mode === "dark" ? "#050505" : "#fff6ea"}
              position="relative"
            >
              <Spline scene="https://prod.spline.design/CCxvWVM0B1wGqJzX/scene.splinecode" />
              <Box
                position="absolute"
                right="8px"
                bottom="8px"
                w="120px"
                h="34px"
                borderRadius="14px"
                bg={mode === "dark" ? "#050505" : "#fff6ea"}
                zIndex={3}
                pointerEvents="none"
              />
            </Box>
          </Box>
        </GridItem>
      </Grid>

      <Box mt={10}>
        <ScoreForm
          title="Input Methods"
          eyebrow="02. LANDING INPUT"
          description="Choose `UPI ID`, `Phone No`, or `Document Upload`. Nothing is selected by default."
          redirectTo="/evaluate"
          showPipeline={false}
          showUserIdField={false}
        />
      </Box>
    </Container>
  );
}
