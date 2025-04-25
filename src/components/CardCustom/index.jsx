import { Box } from "@mui/material";

function CardCustom({ children, ...prop }) {
  return <Box onClick={prop.onClick} className={`bg-white dark:bg-zinc-700 shadow-[2px_3px_5px_0px_#0000001f] ${prop.className}`}>{children}</Box>;
}
export default CardCustom;
