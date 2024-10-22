import { useColorScheme } from "@mui/material/styles";
import { ChangeEvent } from "react";
import { MaterialUISwitch } from "./material-switch";
export const ThemeSwitch = () => {

    const { mode, setMode } = useColorScheme();

    if (!mode) {
        return null;
    }

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setMode('dark');
        } else {
            setMode('light');
        }
    }

    return (
        <>
            <MaterialUISwitch defaultChecked onChange={onChange} />
        </>
    )
}