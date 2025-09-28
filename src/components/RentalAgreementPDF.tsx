
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 10,
  },
  agreementTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginTop: 20,
    marginBottom: 10,
  },
  metaInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 8,
    fontSize: 11,
  },
  hirerDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 3,
  },
  detailLabel: {
    width: '120px',
  },
  detailValue: {
    borderBottom: '1px solid #000',
    flexGrow: 1,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '33.33%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '33.33%',
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  financialsTable: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 5,
  },
  financialsRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  financialsColLabel: {
    width: '70%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 5,
  },
  financialsColAmount: {
    width: '30%',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#000',
    padding: 5,
    textAlign: 'right',
  },
  termsSection: {
    marginTop: 15,
  },
  term: {
    marginBottom: 5,
  },
  termTitle: {
    fontWeight: 'bold',
  },
  conditionCheckTable: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 10,
  },
  declaration: {
    marginTop: 30,
  },
  signatureSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 60,
  },
  signatureBox: {
    width: '40%',
    borderTop: '1px solid #000',
    textAlign: 'center',
    paddingTop: 5,
  },
});

// This is a placeholder. You'll pass your actual data in.
const placeholderData = {
  agreementNo: '12345',
  hirer: {
    fullName: 'John Doe',
    nic: '123456789V',
    address: '123, Main Street, Colombo',
    contact: '0771234567',
  },
  equipment: [
    { description: 'Excavator', serial: 'EX123', quantity: 1 },
    { description: 'Drill Machine', serial: 'DM456', quantity: 2 },
  ],
  rentalPeriod: {
    start: '2025-09-28 at 10:00 AM',
    end: '2025-09-30 at 05:00 PM',
  },
  financials: {
    rentalFee: 50000,
    deliveryFee: 2000,
    deposit: 10000,
  },
};

const RentalAgreementPDF = ({ data = placeholderData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>SinghaBuild Equipment Rentals</Text>
        <Text style={styles.address}>Address: No. 123, Galle Road, Colombo 03 | Contact: 011-2345678</Text>
        <Text style={styles.agreementTitle}>EQUIPMENT RENTAL AGREEMENT</Text>
      </View>

      {/* Meta Info */}
      <View style={styles.metaInfo}>
        <Text>Agreement No: {data.agreementNo}</Text>
        <Text>Date: {new Date().toLocaleDateString('en-CA')}</Text>
      </View>

      {/* Parties */}
      <View style={styles.section}>
        <Text>This agreement is between:</Text>
        <Text style={{ marginLeft: 10, marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>1. The Owner:</Text> SinghaBuild Equipment Rentals ("The Company")</Text>
        <Text style={{ marginLeft: 10, marginTop: 5 }}><Text style={{ fontWeight: 'bold' }}>2. The Hirer:</Text></Text>
        <View style={{ marginLeft: 20, marginTop: 5 }}>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Full Name:</Text><Text style={styles.detailValue}>{data.hirer.fullName}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>National ID (NIC) No.:</Text><Text style={styles.detailValue}>{data.hirer.nic}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Address:</Text><Text style={styles.detailValue}>{data.hirer.address}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Contact No.:</Text><Text style={styles.detailValue}>{data.hirer.contact}</Text></View>
        </View>
      </View>

      {/* Equipment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RENTED EQUIPMENT DETAILS</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Item Description</Text>
            <Text style={styles.tableColHeader}>Serial No.</Text>
            <Text style={styles.tableColHeader}>Quantity</Text>
          </View>
          {data.equipment.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{item.description}</Text>
              <Text style={styles.tableCol}>{item.serial}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Rental Period */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RENTAL PERIOD</Text>
        <View style={{ marginLeft: 20 }}>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Start Date & Time:</Text><Text style={styles.detailValue}>{data.rentalPeriod.start}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>End Date & Time:</Text><Text style={styles.detailValue}>{data.rentalPeriod.end}</Text></View>
        </View>
      </View>

      {/* Financials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FINANCIALS</Text>
        <View style={styles.financialsTable}>
          <View style={styles.financialsRow}><Text style={styles.financialsColLabel}>Total Rental Fee</Text><Text style={styles.financialsColAmount}>{data.financials.rentalFee.toFixed(2)}</Text></View>
          <View style={styles.financialsRow}><Text style={styles.financialsColLabel}>Delivery Fee (If any)</Text><Text style={styles.financialsColAmount}>{data.financials.deliveryFee.toFixed(2)}</Text></View>
          <View style={styles.financialsRow}><Text style={styles.financialsColLabel}><Text style={{fontWeight: "bold"}}>Sub Total</Text></Text><Text style={styles.financialsColAmount}><Text style={{fontWeight: "bold"}}>{(data.financials.rentalFee + data.financials.deliveryFee).toFixed(2)}</Text></Text></View>
          <View style={styles.financialsRow}><Text style={styles.financialsColLabel}>Refundable Security Deposit</Text><Text style={styles.financialsColAmount}>{data.financials.deposit.toFixed(2)}</Text></View>
          <View style={styles.financialsRow}><Text style={styles.financialsColLabel}><Text style={{fontWeight: "bold"}}>TOTAL AMOUNT PAID</Text></Text><Text style={styles.financialsColAmount}><Text style={{fontWeight: "bold"}}>{(data.financials.rentalFee + data.financials.deliveryFee + data.financials.deposit).toFixed(2)}</Text></Text></View>
        </View>
      </View>

      {/* Terms and Conditions */}
      <View style={styles.termsSection}>
        <Text style={styles.sectionTitle}>TERMS AND CONDITIONS</Text>
        <Text style={styles.term}>By signing this agreement, the Hirer agrees to the following terms:</Text>
        <View style={{ marginLeft: 10, marginTop: 5 }}>
          <Text style={styles.term}><Text style={styles.termTitle}>1. Condition of Equipment:</Text> The Hirer acknowledges receiving the equipment listed above in good, clean, and operational condition.</Text>
          <Text style={styles.term}><Text style={styles.termTitle}>2. Security Deposit:</Text> The deposit is held to cover any damage, loss, or late return fees. It is fully refundable upon the timely return of the equipment in its original condition, except for normal wear and tear.</Text>
          <Text style={styles.term}><Text style={styles.termTitle}>3. Use of Equipment:</Text> The Hirer agrees to use the equipment in a safe and proper manner, only for its intended purpose. The equipment shall not be used for any illegal activity.</Text>
          <Text style={styles.term}><Text style={styles.termTitle}>4. Damage & Loss:</Text> The Hirer is fully responsible for any damage, loss, or theft of the equipment during the rental period. Repair or replacement costs will be deducted from the security deposit. If costs exceed the deposit, the Hirer agrees to pay the remaining balance.</Text>
          <Text style={styles.term}><Text style={styles.termTitle}>5. Return of Equipment:</Text> The equipment must be returned on the specified end date and time. It must be returned clean and in the same condition it was received. For fuel-powered machines, they must be returned with a full tank of fuel.</Text>
          <Text style={styles.term}><Text style={styles.termTitle}>6. Late Returns:</Text> If the equipment is not returned on time, a late fee equal to the standard daily rental rate will be charged for each additional day until it is returned.</Text>
          <Text style={styles.term}><Text style={styles.termTitle}>7. Liability:</Text> The Hirer assumes all risk and liability for any injury or property damage arising from the use, operation, or transportation of the equipment. SinghaBuild Equipment Rentals is not responsible for any accidents.</Text>
        </View>
      </View>

      {/* Equipment Condition Check */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>EQUIPMENT CONDITION CHECK (උපකරණ තත්ත්වය පරීක්ෂා කිරීම)</Text>
        <View style={styles.conditionCheckTable}>
          <View style={styles.tableRow}><Text style={[styles.tableColHeader, {width: '40%'}]}>Condition Check</Text><Text style={[styles.tableColHeader, {width: '30%'}]}>At Checkout</Text><Text style={[styles.tableColHeader, {width: '30%'}]}>At Check-in</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, {width: '40%'}]}>Runs Correctly</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, {width: '40%'}]}>Clean</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, {width: '40%'}]}>No Damage</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes</Text></View>
          <View style={styles.tableRow}><Text style={[styles.tableCol, {width: '40%'}]}>Fuel Full (if applicable)</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes ☐ N/A</Text><Text style={[styles.tableCol, {width: '30%'}]}>☐ Yes ☐ N/A</Text></View>
        </View>
        <Text style={{ marginTop: 5 }}>Notes on Damage/Scratches:</Text>
        <View style={{ borderBottom: '1px solid #000', height: 30, marginTop: 5 }}></View>
      </View>

      {/* Declaration */}
      <View style={styles.declaration}>
        <Text style={styles.sectionTitle}>DECLARATION</Text>
        <Text>I, the Hirer, confirm that I have read, understood, and agree to all the terms and conditions outlined in this agreement.</Text>
      </View>

      {/* Signatures */}
      <View style={styles.signatureSection}>
        <View style={styles.signatureBox}>
          <Text>Signature of Hirer</Text>
        </View>
        <View style={styles.signatureBox}>
          <Text>For SinghaBuild Equipment Rentals</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default RentalAgreementPDF;
