import React from "react";
import {Box, Center, Heading, Flex, Spinner, Text, Spacer} from "@chakra-ui/react";


export function Splashscreen({ onClick }: { onClick: () => void }) {
  return (
    <Center w={"100%"} h={"100%"} onClick={onClick}>
      <Flex direction={"column"} justify={"center"} textAlign={"center"}>
        <Box>Logo</Box>
        <Box mb={100} ><Heading as={"h1"}>HONEYPOT</Heading></Box>
        <Box>
          <Spinner />
        </Box>
        <Box>
          <Text>Copyright &copy; 2022</Text>
        </Box>
      </Flex>
    </Center>
  );
}
