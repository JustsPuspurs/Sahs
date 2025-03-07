import React from "react";

const MoveList = ({ movePairs }) => {
    return (
        <div className="move-list" style={{ width: "100%", margin: "20px auto" }}>
            <table className="move-table-container">
                <thead>
                    <tr>
                        <th
                            className="move-table-header"
                            style={{ textAlign: "center" }}
                        >
                            White
                        </th>
                        <th
                            className="move-table-header"
                            style={{ textAlign: "center" }}
                        >
                            Black
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {movePairs.map((pair, index) => (
                        <tr key={index}>
                            <td
                                className="move-table-cell"
                                style={{ textAlign: "center" }}
                            >
                                {pair.white}
                            </td>
                            <td
                                className="move-table-cell"
                                style={{ textAlign: "center" }}
                            >
                                {pair.black}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MoveList;
