import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Input,
  Progress,
  Radio,
  Stack,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { scoreUser, ScoreRequest, ScoreResponse } from "@/lib/api";
import {
  saveScoreHistory,
  ScoreHistoryEntry,
  ScoreInputMethod,
} from "@/lib/storage";

type ScoreFormValues = {
  user_id: string;
  input_type: "consent_handle" | "upi_id" | "phone_number";
  consent_handle?: string;
  upi_id?: string;
  phone_number?: string;
  include_reasons: boolean;
};

const pipelineSteps = [
  "Collecting behavioral signals",
  "Building trust graph",
  "Running AI model",
  "Preparing score insights",
];

function formatRequest(values: ScoreFormValues): ScoreRequest {
  const request: ScoreRequest = {
    user_id: values.user_id,
    include_reasons: values.include_reasons,
  };

  if (values.input_type === "consent_handle") {
    request.consent_handle = values.consent_handle;
  }
  if (values.input_type === "upi_id") {
    request.upi_id = values.upi_id;
  }
  if (values.input_type === "phone_number") {
    request.phone_number = values.phone_number;
  }

  return request;
}

function buildHistoryEntry(
  request: ScoreRequest,
  inputMethod: ScoreInputMethod,
  response: ScoreResponse
): ScoreHistoryEntry {
  return {
    ...response,
    user_id: request.user_id,
    input_method: inputMethod,
    requested_at: new Date().toISOString(),
  };
}

export function ScoreForm() {
  const router = useRouter();
  const [result, setResult] = useState<ScoreResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pipelineStage, setPipelineStage] = useState(0);
  const [progress, setProgress] = useState(12);
  const [documents, setDocuments] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setError: setFieldError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ScoreFormValues>({
    defaultValues: {
      user_id: "",
      input_type: "upi_id",
      consent_handle: "",
      upi_id: "",
      phone_number: "",
      include_reasons: true,
    },
  });

  const inputType = watch("input_type");

  useEffect(() => {
    if (!isSubmitting) {
      setPipelineStage(0);
      setProgress(12);
      return;
    }

    const timer = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) {
          return current;
        }

        const next = Math.min(current + 14, 92);
        setPipelineStage(Math.min(Math.floor(next / 26), pipelineSteps.length - 1));
        return next;
      });
    }, 700);

    return () => window.clearInterval(timer);
  }, [isSubmitting]);

  const activeInputLabel = useMemo(() => {
    if (inputType === "consent_handle") {
      return "Consent Handle";
    }
    if (inputType === "phone_number") {
      return "Phone Number";
    }
    return "UPI ID";
  }, [inputType]);

  async function onSubmit(values: ScoreFormValues) {
    setError(null);
    setResult(null);

    const userId = values.user_id.trim();
    if (!userId) {
      setFieldError("user_id", {
        type: "required",
        message: "User ID is required",
      });
      return;
    }

    const request = formatRequest(values);
    request.user_id = userId;

    try {
      const response = await scoreUser(request);
      setProgress(100);
      setPipelineStage(pipelineSteps.length - 1);
      setResult(response);

      saveScoreHistory(
        buildHistoryEntry(request, values.input_type, response)
      );

      window.setTimeout(() => {
        void router.push("/dashboard");
      }, 550);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to fetch score.");
    }
  }

  function handleDocumentChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setDocuments(files);
  }

  return (
    <Grid templateColumns={["1fr", null, "1.05fr 0.95fr"]} gap={8}>
      <GridItem>
        <Box
          p={[6, 8]}
          borderWidth="1px"
          borderRadius="30px"
          bg="rgba(16, 18, 24, 0.92)"
          boxShadow="0 24px 80px rgba(0, 0, 0, 0.35)"
        >
          <VStack align="stretch" spacing={6}>
            <Box>
              <Text color="#f6c45a" letterSpacing="0.18em" fontSize="xs" mb={2}>
                02. INPUT PAGE
              </Text>
              <Text fontSize={["3xl", "4xl"]} fontWeight="bold">
                Evaluate User
              </Text>
              <Text color="#b7ab8b" mt={2}>
                Enter a UPI ID, consent handle, or phone number to run the same
                backend scoring pipeline.
              </Text>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={5} align="stretch">
                <FormControl isInvalid={!!errors.user_id}>
                  <FormLabel color="#e8d7ac">User ID</FormLabel>
                  <Input
                    {...register("user_id")}
                    placeholder="user_123_abc"
                    h="56px"
                    borderRadius="18px"
                    bg="rgba(10, 12, 16, 0.95)"
                    color="#f8eed7"
                  />
                  <Text color="#ff9075" mt={1} fontSize="sm">
                    {errors.user_id?.message}
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel color="#e8d7ac">Input Method</FormLabel>
                  <Stack direction={["column", "row"]} spacing={4}>
                    <Radio value="upi_id" {...register("input_type")}>
                      UPI ID
                    </Radio>
                    <Radio value="phone_number" {...register("input_type")}>
                      Phone Number
                    </Radio>
                    <Radio value="consent_handle" {...register("input_type")}>
                      Consent Handle
                    </Radio>
                  </Stack>
                </FormControl>

                {inputType === "consent_handle" && (
                  <FormControl>
                    <FormLabel color="#e8d7ac">Consent Handle</FormLabel>
                    <Input
                      {...register("consent_handle")}
                      placeholder="ch_1234567890"
                      h="56px"
                      borderRadius="18px"
                      bg="rgba(10, 12, 16, 0.95)"
                    />
                  </FormControl>
                )}

                {inputType === "upi_id" && (
                  <FormControl>
                    <FormLabel color="#e8d7ac">UPI ID</FormLabel>
                    <Input
                      {...register("upi_id")}
                      placeholder="user@bankupi"
                      h="56px"
                      borderRadius="18px"
                      bg="rgba(10, 12, 16, 0.95)"
                    />
                  </FormControl>
                )}

                {inputType === "phone_number" && (
                  <FormControl>
                    <FormLabel color="#e8d7ac">Phone Number</FormLabel>
                    <Input
                      {...register("phone_number")}
                      placeholder="+91 9876543210"
                      h="56px"
                      borderRadius="18px"
                      bg="rgba(10, 12, 16, 0.95)"
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel color="#e8d7ac">Upload Documents</FormLabel>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleDocumentChange}
                    h="auto"
                    py={3}
                    borderRadius="18px"
                    bg="rgba(10, 12, 16, 0.95)"
                  />
                  <Text mt={2} color="#a99972" fontSize="sm">
                    Add bank statements, utility bills, rent proofs, or other supporting files.
                  </Text>
                  {documents.length > 0 && (
                    <VStack mt={3} align="stretch" spacing={2}>
                      {documents.map((file) => (
                        <Text key={`${file.name}-${file.size}`} color="#d8caab" fontSize="sm">
                          {file.name}
                        </Text>
                      ))}
                    </VStack>
                  )}
                </FormControl>

                <Flex
                  justify="space-between"
                  align="center"
                  px={4}
                  py={3}
                  borderWidth="1px"
                  borderRadius="18px"
                  bg="rgba(255,255,255,0.02)"
                >
                  <Box>
                    <Text fontWeight="semibold">Explainability</Text>
                    <Text color="#a99972" fontSize="sm">
                      Include reason codes from the backend response.
                    </Text>
                  </Box>
                  <Switch id="include_reasons" {...register("include_reasons")} />
                </Flex>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  h="58px"
                  borderRadius="18px"
                  bg="#f6c45a"
                  color="#17130b"
                  fontWeight="bold"
                  _hover={{ bg: "#ffd67d" }}
                >
                  Run AI Evaluation
                </Button>

                <HStack color="#8f856c" fontSize="sm" spacing={3}>
                  <Text>Secure</Text>
                  <Text>•</Text>
                  <Text>Private</Text>
                  <Text>•</Text>
                  <Text>Encrypted</Text>
                </HStack>
              </VStack>
            </form>

            {error && (
              <Alert status="error" borderRadius="18px" bg="rgba(120, 24, 24, 0.35)">
                <AlertIcon />
                <Box>
                  <AlertTitle>Request failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}

            {result && (
              <Alert status="success" borderRadius="18px" bg="rgba(26, 83, 46, 0.32)">
                <AlertIcon />
                <Box>
                  <AlertTitle>Evaluation complete</AlertTitle>
                  <AlertDescription>
                    Score {result.axiom_score} generated. Opening dashboard now.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>
        </Box>
      </GridItem>

      <GridItem>
        <VStack spacing={6} align="stretch">
          <Box
            p={[6, 8]}
            borderWidth="1px"
            borderRadius="30px"
            bg="rgba(16, 18, 24, 0.92)"
            minH="340px"
          >
            <Text color="#f6c45a" letterSpacing="0.18em" fontSize="xs" mb={2}>
              03. AI PIPELINE
            </Text>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              AI Evaluation in Progress
            </Text>
            <Text color="#b7ab8b" mb={8}>
              The interface mirrors your wireframe, while the API call still hits
              the original scoring backend.
            </Text>

            <HStack justify="space-between" align="flex-start" spacing={3} mb={8}>
              {pipelineSteps.map((step, index) => {
                const active = index <= pipelineStage || result;
                return (
                  <VStack key={step} spacing={3} flex="1" align="center">
                    <Flex
                      w="62px"
                      h="62px"
                      borderRadius="full"
                      align="center"
                      justify="center"
                      borderWidth="2px"
                      borderColor={active ? "#f6c45a" : "rgba(255,255,255,0.18)"}
                      color={active ? "#f6c45a" : "#7f7661"}
                    >
                      <Text fontWeight="bold">{index + 1}</Text>
                    </Flex>
                    <Text textAlign="center" fontSize="sm" color={active ? "#f5e3ba" : "#8d8268"}>
                      {step}
                    </Text>
                  </VStack>
                );
              })}
            </HStack>

            <Box
              p={5}
              borderWidth="1px"
              borderRadius="22px"
              bg="rgba(255,255,255,0.02)"
            >
              <Text color="#c7b17c" mb={3}>
                Processing {activeInputLabel}
              </Text>
              <Progress
                value={progress}
                size="sm"
                borderRadius="full"
                sx={{
                  "& > div": {
                    background:
                      "linear-gradient(90deg, rgba(244,190,75,0.7) 0%, #f6c45a 100%)",
                  },
                }}
              />
              <Text mt={3} color="#a99972" fontSize="sm">
                {isSubmitting
                  ? pipelineSteps[pipelineStage]
                  : "Ready to analyze behavioral patterns and trust signals."}
              </Text>
            </Box>
          </Box>

            <Box
              p={6}
              borderWidth="1px"
            borderRadius="24px"
            bg="rgba(16, 18, 24, 0.92)"
          >
            <Text color="#f6c45a" fontWeight="semibold" mb={3}>
              Why This Matches Your Backend
            </Text>
            <VStack align="stretch" spacing={3} color="#c6b894">
              <Text>Same `/v1/score` API call and request fields.</Text>
              <Text>Same backend-generated `axiom_score`, tier, confidence, and reasons.</Text>
              <Text>Uploaded documents are currently UI-only, so your backend logic remains unchanged.</Text>
              <Text>Frontend only changes the experience, not the scoring logic.</Text>
            </VStack>
          </Box>
        </VStack>
      </GridItem>
    </Grid>
  );
}
