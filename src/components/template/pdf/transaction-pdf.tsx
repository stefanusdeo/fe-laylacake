import type { ITransactionDetail } from "@/types/transactionTypes"
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { format, parseISO } from "date-fns"
import type React from "react"

const styles = StyleSheet.create({
    page: {
        padding: 4,
        fontSize: 9, // Increased from 7 to 9
        fontFamily: "Times-Roman",
        width: 136, // 48mm ≈ 136pt
    },
    center: {
        textAlign: "center",
    },
    bold: {
        fontWeight: "bold",
    },
    section: {
        marginBottom: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 3,
        textAlign: "left", // Added center alignment for all rows
    },
    product: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 1,
        textAlign: "left", // Added center alignment for all rows
    },
    hr: {
        borderBottomWidth: 0.5,
        marginVertical: 2,
    },
    smallText: {
        fontSize: 8, // Increased from 6 to 8
    },
    title: {
        fontSize: 12, // Increased from 9 to 12
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 2,
    },
})

interface TransactionPDFProps {
    transaction: ITransactionDetail
}

const TransactionPDF: React.FC<TransactionPDFProps> = ({ transaction }) => {
    const formattedDate = format(parseISO(transaction.created_at), "yyyy-MM-dd")
    const totalDiscount = transaction.transaction_items.reduce((sum, item) => sum + item.discount_nominal, 0)

    return (
        <Document>
            <Page size={{ width: 136, height: 500 }} style={styles.page}>
                {/* Header */}
                <View style={[styles.section, { marginBottom: 5 }]}>
                    <Text style={styles.title}>Layla Cake</Text>
                    <Text style={[styles.bold, styles.center]}>{transaction.outlet.npwp}</Text>
                </View>

                {/* Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={{ width: "30%", textAlign: "center", }}>Code</Text>
                        <Text style={{ width: "70%", textAlign: "center", }}>{transaction.code}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ width: "30%", textAlign: "center", }}>Date</Text>
                        <Text style={[styles.bold, { width: "70%", textAlign: "center", }]}>
                            {formattedDate} ({transaction.time || ""})
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ width: "30%", textAlign: "center", }}>Outlet</Text>
                        <Text style={{ width: "70%", textAlign: "center", }}>{transaction.outlet.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ width: "30%", textAlign: "center", }}>Telp</Text>
                        <Text style={{ width: "70%", textAlign: "center", }}>{transaction.outlet.phone_number}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ width: "30%", textAlign: "center", }}>Staff</Text>
                        <Text style={{ width: "70%", textAlign: "center", }}>{transaction.staff.name}</Text>
                    </View>
                </View>

                <View style={styles.hr} />

                {/* Items List */}
                <View style={styles.section}>
                    {transaction.transaction_items.map((item, i) => (
                        <View key={i} style={styles.product}>
                            <Text style={{ width: "65%", textAlign: "center", }}>{item.item_name}</Text>
                            <Text style={{ width: "10%", textAlign: "center", }}>{item.quantity}</Text>
                            <Text style={{ width: "25%", textAlign: "right", }}>
                                {(item.price - (item.discount_nominal || 0)).toLocaleString("id-ID")}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.hr} />

                {/* Summary */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={{ width: "65%", textAlign: "center", }}>Potongan</Text>
                        <Text style={{ width: "35%", textAlign: "center", }}>{totalDiscount.toLocaleString("id-ID")}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ width: "65%", textAlign: "center", }}>Total</Text>
                        <Text style={{ width: "35%", textAlign: "center", }}>{transaction.total_price.toLocaleString("id-ID")}</Text>
                    </View>
                </View>

                <View style={styles.hr} />

                {/* Payment */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={{ width: "65%", textAlign: "center", }}>Uang diterima</Text>
                        <Text style={{ width: "35%", textAlign: "center", }}>{transaction.pay.toLocaleString("id-ID")}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ width: "65%", textAlign: "center", }}>Kembali</Text>
                        <Text style={[styles.bold, { width: "35%", textAlign: "center", }]}>{transaction.money_change.toLocaleString("id-ID")}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={[styles.section, { marginTop: 10, }]}>
                    <Text>
                        Metode : <Text style={styles.bold}>{transaction.payment_method.name}</Text>
                    </Text>
                </View>
            </Page>
        </Document>
    )
}

export default TransactionPDF
