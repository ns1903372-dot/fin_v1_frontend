import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { TopNav } from "@/components/TopNav";
import { VerifyForm } from "@/components/VerifyForm";

export default function VerifyPage() {
  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />
      <VStack spacing={8} align="stretch">
        <Box>
          <Text fontSize={["3xl", "4xl"]} fontWeight="bold">
            Verification Workspace
          </Text>
          <Text mt={3} color="#b7ab8b" maxW="700px">
            Styled to match the main Axiom product while still using the same
            `/v1/verify` backend endpoint.
          </Text>
        </Box>
        <VerifyForm />
      </VStack>
    </Container>
  );
}
