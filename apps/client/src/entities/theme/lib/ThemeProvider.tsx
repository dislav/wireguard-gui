import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Theme } from '../model/types';
import { useAppDispatch } from '@/shared/model';
import { changeTheme, selectTheme } from '@/entities/theme';

interface ThemeProviderProps {
    theme?: Theme;
    children: React.ReactNode;
}

export default function ThemeProvider({ theme, children }: ThemeProviderProps) {
    const dispatch = useAppDispatch();
    const currentTheme = useSelector(selectTheme);

    useEffect(() => {
        if (theme && theme !== currentTheme) {
            dispatch(changeTheme(theme));

            return;
        }

        document.documentElement.className = currentTheme;
    }, [theme, currentTheme, dispatch]);

    return children;
}
