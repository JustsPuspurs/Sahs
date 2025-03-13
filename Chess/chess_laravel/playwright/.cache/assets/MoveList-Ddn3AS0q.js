import { j as jsxRuntimeExports } from './index-IEtSwbCF.js';

const MoveList = ({ movePairs }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "move-list", style: { width: "100%", margin: "20px auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "move-table-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "move-table-header",
          style: { textAlign: "center" },
          children: "White"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "move-table-header",
          style: { textAlign: "center" },
          children: "Black"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: movePairs.map((pair, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          className: "move-table-cell",
          style: { textAlign: "center" },
          children: pair.white
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          className: "move-table-cell",
          style: { textAlign: "center" },
          children: pair.black
        }
      )
    ] }, index)) })
  ] }) });
};

export { MoveList as default };
//# sourceMappingURL=MoveList-Ddn3AS0q.js.map
