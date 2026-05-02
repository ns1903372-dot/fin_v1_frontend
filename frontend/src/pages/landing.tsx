import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Box, Container } from "@chakra-ui/react";
import { ScoreForm } from "@/components/ScoreForm";
import { TiltCardImage } from "@/components/TiltCardImage";
import { TopNav } from "@/components/TopNav";

const MotionBox = motion(Box);

export default function LandingPage() {
  const visualRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start start", "end start"],
  });
  const imageOpacity = useTransform(scrollYProgress, [0, 0.32, 0.62, 1], [1, 0.82, 0.28, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -36]);
  const imageScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.985, 0.96]);

  return (
    <Container maxW="container.xl" py={[5, 8]} px={[4, 6]}>
      <TopNav />

      <Box
        ref={visualRef}
        mt={8}
        p={[4, 5]}
        borderWidth="1px"
        borderRadius="34px"
        bg="rgba(16, 18, 24, 0.96)"
        boxShadow="0 28px 70px rgba(0, 0, 0, 0.38)"
        overflow="hidden"
        minH={["360px", "440px", "540px"]}
        position="relative"
      >
        <MotionBox
          h="100%"
          minH={["320px", "400px", "500px"]}
          borderWidth="1px"
          borderRadius="26px"
          overflow="hidden"
          bg="#050505"
          position="relative"
          style={{ opacity: imageOpacity }}
        >
          <Box
            position="absolute"
            inset="0"
            bg="radial-gradient(circle at 50% 24%, rgba(246,196,90,0.16) 0%, rgba(246,196,90,0.04) 24%, rgba(0,0,0,0) 54%), linear-gradient(180deg, rgba(8,8,8,0.86) 0%, rgba(4,4,4,0.96) 100%)"
          />
          <MotionBox
            position="absolute"
            inset="0"
            display="flex"
            alignItems="center"
            justifyContent="center"
            px={[4, 8]}
            style={{ y: imageY, scale: imageScale }}
          >
            <Box
              w="100%"
              maxW={["380px", "460px", "540px"]}
              position="relative"
              opacity={0.84}
            >
              <TiltCardImage
                src="/landing-credit-card-transparent.png"
                alt="Vouch landing credit card"
                width={320}
              />
            </Box>
          </MotionBox>
          <Box
            position="absolute"
            inset="auto 0 0 0"
            h="86px"
            bg="linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.68) 46%, rgba(5,5,5,0.96) 100%)"
          />
        </MotionBox>
      </Box>

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
