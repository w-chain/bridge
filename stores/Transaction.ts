import { defineStore } from 'pinia'
import type { BridgeTransaction } from '~~/shared/types/transaction'
import { TransactionStatus } from '~~/shared/types/enums'

export const useTransactionStore = defineStore('Transaction', () => {
  const STORAGE_KEY = 'bridge_transactions'
  const toast = useToast()

  // State
  const transactions = ref<BridgeTransaction[]>([])
  const loading = ref(false)

  // Initialize from localStorage
  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        transactions.value = JSON.parse(stored)
      } catch (error) {
        console.error('Failed to parse stored transactions:', error)
        toast.add({
          title: 'Error',
          description: 'Failed to load stored transactions',
          color: 'error',
        })
      }
    }
  })

  // Save to localStorage
  function persistTransactions() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions.value))
  }

  // CRUD Operations
  function addTransaction(transaction: BridgeTransaction) {
    transactions.value.push(transaction)
    persistTransactions()
  }

  function updateDepositNonce(txHash: string, depositNonce: string) {
    const index = transactions.value.findIndex(tx => tx.txHash === txHash)
    if (index !== -1 && transactions.value[index]) {
      transactions.value[index].depositNonce = depositNonce
      persistTransactions()
      return true
    }
    return false
  }

  function updateTransactionStatus(txHash: string, status: TransactionStatus) {
    const index = transactions.value.findIndex(tx => tx.txHash === txHash)
    if (index !== -1 && transactions.value[index]) {
      transactions.value[index].status = status
      persistTransactions()
      return true
    }
    return false
  }

  function removeTransaction(txHash: string) {
    const index = transactions.value.findIndex(tx => tx.txHash === txHash)
    if (index !== -1) {
      transactions.value.splice(index, 1)
      persistTransactions()
      return true
    }
    return false
  }

  function getTransaction(txHash: string) {
    return transactions.value.find(tx => tx.txHash === txHash)
  }

  // Computed Properties
  const pendingTransactions = computed(() => 
    transactions.value.filter(tx => 
      tx.status === TransactionStatus.PENDING || 
      tx.status === TransactionStatus.AWAITING
    )
  )

  const completedTransactions = computed(() =>
    transactions.value.filter(tx => 
      tx.status === TransactionStatus.SUCCESS || 
      tx.status === TransactionStatus.FAILED ||
      tx.status === TransactionStatus.REJECTED
    )
  )

  function clearCompletedTransactions() {
    transactions.value = transactions.value.filter(tx => 
      tx.status === TransactionStatus.PENDING || 
      tx.status === TransactionStatus.AWAITING
    )
    persistTransactions()
  }

  return {
    transactions,
    loading,
    addTransaction,
    updateDepositNonce,
    updateTransactionStatus,
    removeTransaction,
    getTransaction,
    pendingTransactions,
    completedTransactions,
    clearCompletedTransactions
  }
})
