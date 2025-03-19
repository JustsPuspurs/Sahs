import { r as reactExports, j as jsxDevRuntimeExports } from './index-DgpyOq93.js';
import { u as usePage, d as dist } from './index-xOKW9rjh.js';

const Login = ({ isOpen, onClose }) => {
  const { errors } = usePage().props;
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    dist.Inertia.post("/login", { username, password }, {
      onSuccess: () => {
        setUsername("");
        setPassword("");
        setTimeout(() => {
          if (onClose) onClose();
        }, 500);
      }
    });
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "modal", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "modal-content", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "close-button-container", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: onClose, className: "close-button", children: "×" }, void 0, false, {
      fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
      lineNumber: 29,
      columnNumber: 11
    }, undefined) }, void 0, false, {
      fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
      lineNumber: 28,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { children: "Login" }, void 0, false, {
      fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
      lineNumber: 31,
      columnNumber: 9
    }, undefined),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { htmlFor: "username", children: "Username:" }, void 0, false, {
          fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
          lineNumber: 34,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "input",
          {
            id: "username",
            type: "text",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            placeholder: "Username"
          },
          void 0,
          false,
          {
            fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
            lineNumber: 35,
            columnNumber: 13
          },
          undefined
        ),
        errors.username && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "error-message", children: errors.username }, void 0, false, {
          fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
          lineNumber: 42,
          columnNumber: 33
        }, undefined)
      ] }, void 0, true, {
        fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
        lineNumber: 33,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { htmlFor: "password", children: "Password:" }, void 0, false, {
          fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
          lineNumber: 45,
          columnNumber: 13
        }, undefined),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "input",
          {
            id: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "Password"
          },
          void 0,
          false,
          {
            fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
            lineNumber: 46,
            columnNumber: 13
          },
          undefined
        ),
        errors.password && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "error-message", children: errors.password }, void 0, false, {
          fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
          lineNumber: 53,
          columnNumber: 33
        }, undefined)
      ] }, void 0, true, {
        fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
        lineNumber: 44,
        columnNumber: 11
      }, undefined),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "submit", children: "Login" }, void 0, false, {
        fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
        lineNumber: 55,
        columnNumber: 11
      }, undefined)
    ] }, void 0, true, {
      fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
      lineNumber: 32,
      columnNumber: 9
    }, undefined)
  ] }, void 0, true, {
    fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
    lineNumber: 27,
    columnNumber: 7
  }, undefined) }, void 0, false, {
    fileName: "C:/xampp/htdocs/ceram/Sahs/Chess/chess_laravel/resources/js/Pages/Login.jsx",
    lineNumber: 26,
    columnNumber: 5
  }, undefined);
};

export { Login as default };
//# sourceMappingURL=Login-DuTmjQ0Q.js.map
