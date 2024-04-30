import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type props = {
  children: React.ReactNode;
  text: string;
};
const TooltipComp = ({ children, text }: props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="" side="bottom">
          <span className="text-sm">{text}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComp;
