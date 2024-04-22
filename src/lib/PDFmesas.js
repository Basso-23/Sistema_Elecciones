import React, { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { firebase_read } from "@/firebase/firebase";

const PDFmesas = ({ userState }) => {
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    //console.log("firebase_read");
    //* Lee y asigna los datos de la BD requiere: (nombre de la coleccion, variable donde guardar los datos y nombre del campo por el que se ordenara)
    firebase_read("votantes", setSortedData, "mesa");
  }, []);
  useEffect(() => {
    //console.log("CENTRO:", sortedData);
  }, [sortedData]);

  const CurrentTime = () => {
    const currentTime = new Date().toLocaleTimeString();
    return <Text style={styles.fechaRight}>{currentTime}</Text>;
  };

  const CurrentDate = () => {
    const currentDate = new Date().toLocaleDateString();
    return <Text style={styles.fechaRight}>{currentDate}</Text>;
  };

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
      margin: 20,
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
      paddingLeft: 30,
      flexGrow: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      marginLeft: -6,
    },
    headerRight: {
      color: "#ffffff",
      width: "50%",
      padding: 20,
      paddingRight: 30,
      flexGrow: 1,
      alignItems: "flex-end",
      justifyContent: "center",
    },
    registroContainer: {
      flexDirection: "column",
      width: 115,
      marginRight: -8,
    },
    tableRowFecha: {
      marginTop: -4,
      marginBottom: 2,
      flexDirection: "row",
    },
    fechaLeft: {
      fontSize: 9,
      paddingLeft: 8,
      fontFamily: "Regular",
    },
    fechaRight: {
      fontSize: 9,
      fontFamily: "Regular",
      paddingRight: 8,
    },
    tableRowInfo: {
      flexDirection: "row",
      marginTop: -6,
      marginBottom: 11,
    },
    infoLeft: {
      width: "50%",
      fontFamily: "Regular",
    },
    infoRight: {
      width: "50%",
      fontFamily: "Regular",
      textAlign: "right",
    },
    infoTitle: {
      fontFamily: "Regular",
      fontSize: 9,
      marginBottom: 2,
    },
    infoValue: {
      fontFamily: "Bold",
      fontSize: 12,
      textTransform: "uppercase",
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
    logo: {
      width: 100, // Ancho deseado
      height: 55, // Alto deseado
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/*//* Header Container */}
        <View style={styles.headerContainer}>
          {/*//* Left */}
          <View style={styles.headerLeft}>
            <View style={styles.registroContainer}>
              {/*//* Registro */}
              <Text style={styles.tableCellTitulo}>REGISTRO</Text>
              {/*//* Fecha */}
              <View style={styles.tableRowFecha}>
                <Text style={styles.fechaLeft}>Fecha: </Text>
                <CurrentDate />
              </View>
              {/*//* Hora */}
              <View style={styles.tableRow}>
                <Text style={styles.fechaLeft}>Hora: </Text>
                <CurrentTime />
              </View>
            </View>
          </View>
          {/*//* Right */}
          <View style={styles.headerRight}>
            <Image
              style={styles.logo}
              src={"https://i.imgur.com/4L784IZ.png"}
            />
          </View>
        </View>

        <View style={styles.section}>
          {/*//* Info */}
          <View style={styles.tableRowInfo}>
            <View style={styles.infoLeft}>
              <Text style={styles.infoTitle}>Registro emitido por: </Text>
              {userState ? (
                <Text style={styles.infoValue}>{userState.split("@")[0]} </Text>
              ) : null}
            </View>
            <View style={styles.infoRight}>
              <Text style={styles.infoTitle}>Ordenado por: </Text>
              <Text style={styles.infoValue}>MESA </Text>
            </View>
          </View>
          <View style={styles.table}>
            {/*//* Titulos */}
            <View style={styles.tableRowTitulos}>
              <View style={styles.tableColNombre}>
                <Text style={styles.tableCellTitulo}>NOMBRE</Text>
              </View>
              <View style={styles.tableColCedula}>
                <Text style={styles.tableCellTitulo}>CÉDULA </Text>
              </View>
              <View style={styles.tableColVotoyMesa}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCellVoto}>VOTO</Text>
                  <Text style={styles.tableCellMesa}>MESA</Text>
                </View>
              </View>
              <View style={styles.tableColCentro}>
                <Text style={styles.tableCellTitulo}>CENTRO DE VOTACIÓN</Text>
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

export default PDFmesas;
