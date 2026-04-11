import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
    {
        ignores: ["dist", "node_modules", ".heroui-docs", "*.config.js", "*.config.ts"],
    },
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", {allowConstantExport: true}],
            "@typescript-eslint/no-unused-vars": ["error", {argsIgnorePattern: "^_", varsIgnorePattern: "^_"}],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": ["warn", {allow: ["warn", "error"]}],
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "react",
                            importNames: [
                                "memo",
                                "Fragment",
                                "forwardRef",
                                "lazy",
                                "useActionState",
                                "useCallback",
                                "useContext",
                                "useDebugValue",
                                "useDeferredValue",
                                "useEffect",
                                "useId",
                                "useImperativeHandle",
                                "useInsertionEffect",
                                "useLayoutEffect",
                                "useMemo",
                                "useOptimistic",
                                "useReducer",
                                "useRef",
                                "useState",
                                "useSyncExternalStore",
                                "useTransition",
                            ],
                            message: "Use React.xxx() instead of importing React APIs directly.",
                        },
                    ],
                },
            ],
            "no-restricted-syntax": [
                "error",
                {
                    selector: "Program > VariableDeclaration > VariableDeclarator[id.type='Identifier'][id.name=/^[a-z]/][init.type='ArrowFunctionExpression']",
                    message: "Use a function declaration for top-level helpers instead of an arrow function.",
                },
                {
                    selector:
                        "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.type='Identifier'][id.name=/^use[A-Z]/][init.type='ArrowFunctionExpression'], ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.type='Identifier'][id.name=/^use[A-Z]/][init.type='FunctionExpression']",
                    message: "React hooks must use `export function useXxx()` instead of `export const`.",
                },
                {
                    selector: "ExportDefaultDeclaration > FunctionDeclaration, ExportDefaultDeclaration > ClassDeclaration",
                    message: "Use a named export instead of a default export.",
                },
                {
                    selector: "JSXFragment",
                    message: "Use `<React.Fragment>` instead of the fragment shorthand `<>...</>`.",
                },
            ],
        },
    },
];
