import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

ReactGA.initialize("G-S0K68FSDCJ");

export default function GAListener() {
    const location = useLocation();

    useEffect(() => {
        ReactGA.send({
            hitType: "pageview",
            page: location.pathname + location.search,
        });
    }, [location]);

    return null;
}
