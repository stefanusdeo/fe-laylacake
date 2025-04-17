import type React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { format, parseISO } from "date-fns"
import type { ITransactionDetail } from "@/types/transactionTypes"

// Create styles
const styles = StyleSheet.create({
    page: {
        padding: 5,
        fontFamily: "Helvetica",
        fontSize: 8,
        width: 226.8,  // Ukuran A7
    },
    header: {
        marginBottom: 5,
        textAlign: "center",
    },
    title: {
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    address: {
        fontSize: 7,
        marginTop: 1,
    },
    infoSection: {
        borderTop: "1 dotted #000",
        borderBottom: "1 dotted #000",
        paddingVertical: 4,
        marginBottom: 5,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    infoRow: {
        flexDirection: "row",
        width: "100%",
        marginBottom: 2,
    },
    infoLabel: {
        width: "40%",
        fontSize: 7,
    },
    infoValue: {
        width: "60%",
        fontSize: 7,
        textAlign: "right",
    },
    sectionTitle: {
        fontSize: 8,
        fontWeight: "bold",
        marginBottom: 3,
        textTransform: "uppercase",
    },
    itemRow: {
        marginBottom: 4,
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    itemName: {
        fontSize: 8,
        fontWeight: "bold",
    },
    itemCalc: {
        fontSize: 7,
        textAlign: "right",
    },
    itemPrice: {
        fontSize: 7,
    },
    itemDiscount: {
        fontSize: 6,
        color: "#666",
        marginLeft: 5,
    },
    summarySection: {
        borderTop: "1 dotted #000",
        paddingTop: 5,
        marginBottom: 5,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTop: "1 dotted #000",
        borderBottom: "1 dotted #000",
        paddingVertical: 3,
        marginVertical: 3,
        fontWeight: "bold",
    },
    footer: {
        borderTop: "1 dotted #000",
        paddingTop: 4,
        textAlign: "center",
    },
    footerText: {
        fontSize: 8,
        fontWeight: "bold",
    },
    footerSubText: {
        fontSize: 6,
        marginTop: 2,
    },
})

interface TransactionPDFProps {
    transaction: ITransactionDetail
    forPrint?: boolean
}

const TransactionPDF: React.FC<TransactionPDFProps> = ({ transaction, forPrint = false }) => {
    // Format date
    const formattedDate = format(parseISO(transaction.created_at), "dd MMM yyyy")

    // Calculate total discount
    const totalDiscount = transaction.transaction_items.reduce((sum, item) => sum + item.discount_nominal, 0)

    // Calculate total items
    const totalItems = transaction.transaction_items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <Document>
            <Page size={"A7"} style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{transaction.outlet.name}</Text>
                    <Text style={styles.address}>{transaction.outlet.address}</Text>
                </View>

                {/* Transaction Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Receipt:</Text>
                        <Text style={styles.infoValue}>{transaction.code}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date:</Text>
                        <Text style={styles.infoValue}>{formattedDate}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Time:</Text>
                        <Text style={styles.infoValue}>{transaction.time}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Cashier:</Text>
                        <Text style={styles.infoValue}>{transaction.staff.name}</Text>
                    </View>
                </View>

                {/* Items */}
                <View>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {transaction.transaction_items.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemName}>{item.item_name}</Text>
                                <Text style={styles.itemCalc}>
                                    {item.quantity} x {item.price.toLocaleString("id-ID")}
                                </Text>
                            </View>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemPrice}>{item.sub_total.toLocaleString("id-ID")}</Text>
                                {item.discount_nominal > 0 && (
                                    <Text style={styles.itemDiscount}>Discount: -{item.discount_nominal.toLocaleString("id-ID")}</Text>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Items:</Text>
                        <Text style={styles.infoValue}>{totalItems}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Subtotal:</Text>
                        <Text style={styles.infoValue}>{(transaction.total_price + totalDiscount).toLocaleString("id-ID")}</Text>
                    </View>
                    {totalDiscount > 0 && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Discount:</Text>
                            <Text style={styles.infoValue}>-{totalDiscount.toLocaleString("id-ID")}</Text>
                        </View>
                    )}

                    <View style={styles.totalRow}>
                        <Text>TOTAL</Text>
                        <Text>Rp {transaction.total_price.toLocaleString("id-ID")}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{transaction.payment_method.name}:</Text>
                        <Text style={styles.infoValue}>{transaction.pay.toLocaleString("id-ID")}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Change:</Text>
                        <Text style={styles.infoValue}>{transaction.money_change.toLocaleString("id-ID")}</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Thank you for your purchase</Text>
                    <Text style={styles.footerSubText}>* Please keep this receipt for returns *</Text>
                </View>
            </Page>
        </Document>
    )
}

export default TransactionPDF
