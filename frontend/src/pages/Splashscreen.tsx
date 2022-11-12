import React from "react";
import {Box, Center, Heading, Flex, Spinner, Text} from "@chakra-ui/react";
import {motion} from "framer-motion";


export function Splashscreen({ onClick }: { onClick: () => void }) {
  const [show, setShow] = React.useState(true);
  const variants = {
    show: {
    },
    hide: {
      y: [0, -800],
    },
  };
  const onAnimationComplete = () => {
    if (show) {
      return;
    }
    onClick();
  };
  return (
    <Center w={"100%"} h={"100%"} onClick={() => setShow(false) }>
      <motion.div animate={show ? "show" : "hide"} variants={variants} onAnimationComplete={onAnimationComplete}>
        <Flex direction={"column"} justify={"center"} textAlign={"center"}>
          <motion.div animate={{
            scale: [1, 1.5],
            y: [50, 0],
          }}>
            <Box>Logo</Box>
            <Box mb={100}>
              <Heading fontFamily={"'Julius Sans One', sans-serif"} as={"h1"}>HONEY BEE<br/>LOANS</Heading>
            </Box>
          </motion.div>
          <motion.div animate={{
            opacity: [0, 0, 1],
          }}>
            <Box>
              <Spinner />
            </Box>
            <Box>
              <Text>Copyright &copy; 2022</Text>
            </Box>
          </motion.div>
        </Flex>
      </motion.div>
    </Center>
  );
}
