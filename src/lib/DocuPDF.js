import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const DocuPDF = ({ userState }) => {
  return (
    <Document>
      <Page size="A4" style={{ margin: 50, fontSize: 12 }}>
        <View>
          <Text>Funciona</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DocuPDF;
