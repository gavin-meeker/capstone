import {
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useRef } from "react";

const IocDrawer = ({ closeDrawer, currentIoc, isOpen }) => {
  const overlayRef = useRef(null);
  return (
    <>
      {/* TODO: would be cool to find a way to fix the background for drawer when scrolling */}
      <Drawer
        placement={"right"}
        size={800}
        open={isOpen}
        onClose={closeDrawer}
        className="p-4"
        overlayProps={{ className: "bg-black/25 shadow-none" }}
      >
        <div className="mb-6 flex items-center justify-between">
          <Typography variant="h3" color="blue-gray">
            {currentIoc}
          </Typography>
          <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <Typography color="gray" className="mb-8 pr-4 font-normal">
          test
        </Typography>
        <div className="flex gap-2">
          <Button size="sm" variant="outlined">
            Outlined Button
          </Button>
          <Button size="sm">Filled button</Button>
        </div>
      </Drawer>
    </>
  );
};

export default IocDrawer;
