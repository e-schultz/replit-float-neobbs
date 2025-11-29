import React from "react";
import { motion } from "framer-motion";

export const AsciiHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-8 select-none pointer-events-none hidden md:block"
    >
      <pre className="text-[10px] md:text-xs leading-[1.1] text-primary font-bold opacity-80 overflow-x-hidden">
{`
  █████▒██▓     ▒█████   ▄▄▄       ▄▄▄█████▓    ▄▄▄▄    ▄▄▄       ██████ 
▓██   ▒▓██▒    ▒██▒  ██▒▒████▄     ▓  ██▒ ▓▒   ▓█████▄ ▒████▄   ▒██    ▒ 
▒████ ░▒██░    ▒██░  ██▒▒██  ▀█▄   ▒ ▓██░ ▒░   ▒██▒ ▄██▒██  ▀█▄ ░ ▓██▄   
░▓█▒  ░▒██░    ▒██   ██░░██▄▄▄▄██  ░ ▓██▓ ░    ▒██░█▀  ░██▄▄▄▄██  ▒   ██▒
░▒█░   ░██████▒░ ████▓▒░ ▓█   ▓██▒   ▒██▒ ░    ░▓█  ▀█▓ ▓█   ▓██▒▒██████▒▒
 ▒ ░   ░ ▒░▓  ░░ ▒░▒░▒░  ▒▒   ▓▒█░   ▒ ░░      ░▒▓███▀▒ ▒▒   ▓▒█░▒ ▒▓▒ ▒ ░
 ░     ░ ░ ▒  ░  ░ ▒ ▒░   ▒   ▒▒ ░     ░       ▒░▒   ░   ▒   ▒▒ ░░ ░▒  ░ ░
 ░ ░     ░ ░   ░ ░ ░ ▒    ░   ▒      ░          ░    ░   ░   ▒   ░  ░  ░  
           ░  ░    ░ ░        ░  ░              ░            ░  ░      ░  
                                                     ░                    
`}
      </pre>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 mt-4" />
    </motion.div>
  );
};
