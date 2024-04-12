import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const DocuPDF = ({ data }) => {
  const [contenido, setContenido] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    setContenido(data);

    const sort = contenido.sort((a, b) => {
      if (a.activista < b.activista) {
        return -1;
      }
      if (a.activista > b.activista) {
        return 1;
      }
      return 0;
    });

    setSortedData(sort);
  }, [data, contenido]);

  const styles = StyleSheet.create({
    page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      fontSize: 10,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 0.5,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderColor: "#d1d1d1",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "20%", // Ajuste para 6 columnas
      borderStyle: "solid",
      borderWidth: 0.5,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      borderColor: "#d1d1d1",
    },
    tableCell: {
      textAlign: "left",
      textTransform: "capitalize",
      padding: 2,
      paddingLeft: 4,
    },
    gridVoto: {
      width: "65%",
      textAlign: "left",
      textTransform: "capitalize",
      padding: 2,
      paddingLeft: 4,
    },
    gridMesa: {
      width: "35%",
      textAlign: "left",
      textTransform: "capitalize",
      padding: 2,
      paddingLeft: 4,
      borderStyle: "solid",
      borderLeftWidth: 0.5,
      borderColor: "#d1d1d1",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Nombre</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Cédula </Text>
              </View>
              <View style={styles.tableCol}>
                <View style={styles.tableRow}>
                  <Text style={styles.gridVoto}>Voto</Text>
                  <Text style={styles.gridMesa}>Mesa</Text>
                </View>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Centro de Votación</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>Dirigente</Text>
              </View>
            </View>
            {sortedData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.nombre} {item.apellido}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{item.cedula}</Text>
                </View>
                <View style={styles.tableCol}>
                  <View style={styles.tableRow}>
                    {item.estado_de_votacion === "si" ? (
                      <Text style={styles.gridVoto}>Confirmado </Text>
                    ) : (
                      <Text style={styles.gridVoto}>Pendiente </Text>
                    )}

                    <Text style={styles.gridMesa}>{item.mesa}</Text>
                  </View>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {item.centro_de_votacion}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    {" "}
                    {item.activista.split("@")[0]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DocuPDF;
