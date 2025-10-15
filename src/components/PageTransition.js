import { motion } from "framer-motion";

export default function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow"
        >
            {children}
        </motion.div>
    );
}
