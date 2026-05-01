import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { ScoreForm } from "@/components/ScoreForm";
import { TopNav } from "@/components/TopNav";

export default function EvaluatePage() {
  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />
      <VStack spacing={8} align="stretch">
        <Box>
          <Text
            fontSize={["3xl", "4xl"]}
            fontWeight="bold"
            maxW="800px"
          >
            User Evaluation Flow
          </Text>
          <Text mt={3} color="#b7ab8b" maxW="700px">
            This is the second page from your requested flow. It keeps the same
            backend logic and upgrades the UI to match the Axiom wireframe.
          </Text>
        </Box>
        <ScoreForm />
      </VStack>
    </Container>
  );
}
