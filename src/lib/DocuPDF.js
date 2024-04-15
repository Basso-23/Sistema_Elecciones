import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

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

  Font.register({
    family: "Bold",
    src: "http://fonts.gstatic.com/s/robotocondensed/v13/b9QBgL0iMZfDSpmcXcE8nPOYkGiSOYDq_T7HbIOV1hA.ttf",
  });

  Font.register({
    family: "Regular",
    src: "http://fonts.gstatic.com/s/robotocondensed/v13/Zd2E9abXLFGSr9G3YK2MsKDbm6fPDOZJsR8PmdG62gY.ttf",
  });

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      fontSize: 9,
      fontFamily: "Regular",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    headerContainer: {
      flexDirection: "row",
      backgroundColor: "#0061FE",
      fontSize: 25,
      fontFamily: "Bold",
    },
    headerLeft: {
      color: "#ffffff",
      width: "50%",
      padding: 20,
      flexGrow: 1,
      alignItems: "flex-start",
      justifyContent: "center",
    },
    headerRight: {
      color: "#ffffff",
      width: "50%",
      padding: 20,
      flexGrow: 1,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    registroContainer: {
      flexDirection: "column",
      width: 115,
    },
    fechaLeft: {
      fontSize: 10,
      width: "50%",
      paddingLeft: 8,
      fontFamily: "Bold",
    },
    fechaRight: {
      fontSize: 10,
      width: "50%",
      fontFamily: "Regular",
      textAlign: "right",
      paddingRight: 8,
    },
    tableRowTitulos: {
      marginTop: 10,
      marginBottom: 4,
      flexDirection: "row",
      fontFamily: "Bold",
      backgroundColor: "#0061FE",
      color: "#ffffff",
      fontSize: 8,
    },
    table: {
      display: "table",
      width: "auto",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableColNombre: {
      width: "20%", // Ajuste para 6 columnas
    },
    tableColCedula: {
      width: "15%", // Ajuste para 6 columnas
    },
    tableColVotoyMesa: {
      width: "25%", // Ajuste para 6 columnas
    },
    tableColCentro: {
      width: "20%", // Ajuste para 6 columnas
    },
    tableColDirigente: {
      width: "20%", // Ajuste para 6 columnas
    },
    tableCellTitulo: {
      textAlign: "left",
      padding: 2,
      paddingLeft: 6,
      paddingTop: 8,
      paddingBottom: 8,
    },
    tableRowContenido: {
      flexDirection: "row",
      marginBottom: 4,
      backgroundColor: "#f7f7f7",
    },
    tableCell: {
      textAlign: "left",
      textTransform: "capitalize",
      padding: 2,
      paddingLeft: 6,
      paddingTop: 8,
      paddingBottom: 8,
      fontWeight: "bold",
    },
    tableCellVoto: {
      width: "50%",
      textAlign: "left",
      textTransform: "capitalize",
      padding: 2,
      paddingLeft: 6,
      paddingTop: 8,
      paddingBottom: 8,
    },
    tableCellMesa: {
      width: "50%",
      textAlign: "center",
      textTransform: "capitalize",
      padding: 2,
      paddingLeft: 6,
      paddingTop: 8,
      paddingBottom: 8,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/*//* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.tableCellTitulo}>LOGO</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.registroContainer}>
              <Text style={styles.tableCellTitulo}>REGISTRO</Text>
              <View style={styles.tableRow}>
                <Text style={styles.fechaLeft}>Fecha:</Text>
                <Text style={styles.fechaRight}>12/4/2024</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.fechaLeft}>Hora:</Text>
                <Text style={styles.fechaRight}>15:51:04</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.table}>
            {/*//* Titulos */}
            <View style={styles.tableRowTitulos}>
              <View style={styles.tableColNombre}>
                <Text style={styles.tableCellTitulo}>NOMBRE</Text>
              </View>
              <View style={styles.tableColCedula}>
                <Text style={styles.tableCellTitulo}>CEDULA </Text>
              </View>
              <View style={styles.tableColVotoyMesa}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellVoto}>VOTO</Text>
                  <Text style={styles.tableCellMesa}>MESA</Text>
                </View>
              </View>
              <View style={styles.tableColCentro}>
                <Text style={styles.tableCellTitulo}>CENTRO DE VOTACION</Text>
              </View>
              <View style={styles.tableColDirigente}>
                <Text style={styles.tableCellTitulo}>DIRIGENTE</Text>
              </View>
            </View>
            {/*//* Contenido de la tabla */}
            {sortedData.map((item, index) => (
              <View key={index} style={styles.tableRowContenido}>
                {/*//* Nombre */}
                <View style={styles.tableColNombre}>
                  <Text style={styles.tableCell}>
                    {item.nombre} {item.apellido}
                  </Text>
                </View>

                {/*//* Cedula */}
                <View style={styles.tableColCedula}>
                  <Text style={styles.tableCell}>{item.cedula}</Text>
                </View>

                {/*//* Voto y Mesa */}
                <View style={styles.tableColVotoyMesa}>
                  <View style={styles.tableRow}>
                    {item.estado_de_votacion === "si" ? (
                      <Text style={styles.tableCellVoto}>Confirmado </Text>
                    ) : (
                      <Text style={styles.tableCellVoto}>~ Pendiente </Text>
                    )}

                    <Text style={styles.tableCellMesa}>{item.mesa}</Text>
                  </View>
                </View>

                {/*//* Centro de votacion */}
                <View style={styles.tableColCentro}>
                  <Text style={styles.tableCell}>
                    {item.centro_de_votacion}
                  </Text>
                </View>

                {/*//* Dirigente */}
                <View style={styles.tableColDirigente}>
                  <Text style={styles.tableCell}>
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
