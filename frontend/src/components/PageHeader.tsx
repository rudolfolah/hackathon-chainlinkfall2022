import { Box, Heading } from "@chakra-ui/react";
import {ReactElement} from "react";

export interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return <Box>
    <Heading>{title}</Heading>
    {children}
  </Box>;
}
