import { useState, useEffect } from 'react'

// Simple in-memory SQL query engine
class SimpleDB {
  constructor() {
    this.tables = {}
  }

  createTable(name, columns) {
    this.tables[name] = { columns, rows: [] }
  }

  insert(tableName, values) {
    if (!this.tables[tableName]) throw new Error(`Table ${tableName} not found`)
    const table = this.tables[tableName]
    const row = {}
    table.columns.forEach((col, idx) => {
      row[col] = values[idx]
    })
    table.rows.push(row)
  }

  query(sql) {
    const upperSql = sql.trim().toUpperCase()

    if (upperSql.startsWith('SELECT')) {
      return this.executeSelect(sql)
    } else if (upperSql.startsWith('INSERT')) {
      return this.executeInsert(sql)
    } else if (upperSql.startsWith('CREATE')) {
      return this.executeCreate(sql)
    }
    throw new Error('Unsupported SQL command')
  }

  executeCreate(sql) {
    const match = sql.match(/CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)/i)
    if (!match) throw new Error('Invalid CREATE TABLE syntax')

    const tableName = match[1]
    const columnDef = match[2]
    const columns = columnDef
      .split(',')
      .map(col => {
        const parts = col.trim().split(/\s+/)
        return parts[0]
      })
      .filter(col => col.length > 0)

    this.createTable(tableName, columns)
    return []
  }

  executeInsert(sql) {
    const match = sql.match(/INSERT\s+INTO\s+(\w+)\s+VALUES\s*(.*)/i)
    if (!match) throw new Error('Invalid INSERT syntax')

    const tableName = match[1]
    const valueString = match[2]

    const valueGroups = valueString.match(/\(([^)]+)\)/g)
    if (!valueGroups) throw new Error('Invalid VALUES format')

    valueGroups.forEach(group => {
      const values = group
        .slice(1, -1)
        .split(',')
        .map(v => {
          v = v.trim()
          if (v.toUpperCase() === 'NULL') return null
          if (v.startsWith("'") && v.endsWith("'")) return v.slice(1, -1)
          if (!isNaN(v)) return Number(v)
          return v
        })

      this.insert(tableName, values)
    })

    return []
  }

  executeSelect(sql) {
    const selectMatch = sql.match(/SELECT\s+(.*?)\s+FROM\s+(\w+)(.*)/i)
    if (!selectMatch) throw new Error('Invalid SELECT syntax')

    const selectPart = selectMatch[1].trim()
    const tableName = selectMatch[2]
    const restPart = selectMatch[3].toUpperCase()

    if (!this.tables[tableName]) throw new Error(`Table ${tableName} not found`)

    let rows = [...this.tables[tableName].rows]
    const allColumns = this.tables[tableName].columns

    // Parse WHERE clause
    if (restPart.includes('WHERE')) {
      const whereMatch = sql.match(/WHERE\s+(.*?)(?:ORDER|LIMIT|$)/i)
      if (whereMatch) {
        const whereClause = whereMatch[1].trim()
        rows = rows.filter(row => this.evaluateWhere(row, whereClause))
      }
    }

    // Parse ORDER BY clause
    if (restPart.includes('ORDER BY')) {
      const orderMatch = sql.match(/ORDER\s+BY\s+(.*?)(?:LIMIT|$)/i)
      if (orderMatch) {
        const orderClause = orderMatch[1].trim()
        const [col, direction] = orderClause.split(/\s+/)
        rows.sort((a, b) => {
          const aVal = a[col]
          const bVal = b[col]
          if (aVal < bVal) return direction === 'DESC' ? 1 : -1
          if (aVal > bVal) return direction === 'DESC' ? -1 : 1
          return 0
        })
      }
    }

    // Parse LIMIT clause
    if (restPart.includes('LIMIT')) {
      const limitMatch = sql.match(/LIMIT\s+(\d+)/i)
      if (limitMatch) {
        const limit = parseInt(limitMatch[1])
        rows = rows.slice(0, limit)
      }
    }

    // Select columns
    let columns = allColumns
    if (selectPart !== '*') {
      columns = selectPart.split(',').map(c => c.trim())
    }

    return rows.map(row => {
      const result = {}
      columns.forEach(col => {
        result[col] = row[col]
      })
      return result
    })
  }

  evaluateWhere(row, clause) {
    // Simple WHERE clause evaluation
    const parts = clause.split(/\s+(AND|OR)\s+/i)
    if (parts.length === 1) {
      return this.evaluateCondition(row, clause)
    }

    let result = this.evaluateCondition(row, parts[0])
    for (let i = 1; i < parts.length; i += 2) {
      const operator = parts[i].toUpperCase()
      const nextResult = this.evaluateCondition(row, parts[i + 1])
      if (operator === 'AND') {
        result = result && nextResult
      } else if (operator === 'OR') {
        result = result || nextResult
      }
    }
    return result
  }

  evaluateCondition(row, condition) {
    const match = condition.match(/(\w+)\s*(=|<>|<|>|<=|>=)\s*(.+)/)
    if (!match) return true

    const col = match[1]
    const op = match[2]
    let value = match[3].trim()

    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1)
    } else if (!isNaN(value)) {
      value = Number(value)
    }

    const colValue = row[col]

    switch (op) {
      case '=':
        return colValue === value
      case '<>':
        return colValue !== value
      case '<':
        return colValue < value
      case '>':
        return colValue > value
      case '<=':
        return colValue <= value
      case '>=':
        return colValue >= value
      default:
        return true
    }
  }
}

export function useDuckDB() {
  const [db, setDb] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const database = new SimpleDB()

      // Create tables
      database.query(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          name TEXT,
          email TEXT,
          signup_date TEXT
        )
      `)

      database.query(`
        CREATE TABLE orders (
          id INTEGER PRIMARY KEY,
          user_id INTEGER,
          amount REAL,
          order_date TEXT
        )
      `)

      database.query(`
        CREATE TABLE discounts (
          id INTEGER PRIMARY KEY,
          order_id INTEGER,
          discount_percent REAL,
          reason TEXT
        )
      `)

      // Insert sample data
      database.query(`
        INSERT INTO users VALUES
          (1, 'Alice Johnson', 'alice@example.com', '2023-01-15'),
          (2, 'Bob Smith', 'bob@example.com', '2023-02-20'),
          (3, 'Carol White', 'carol@example.com', '2023-03-10'),
          (4, 'David Brown', 'david@example.com', '2023-04-05'),
          (5, 'Eve Davis', 'eve@example.com', '2023-05-12')
      `)

      database.query(`
        INSERT INTO orders VALUES
          (1, 1, 99.99, '2023-06-01'),
          (2, 1, 149.99, '2023-06-15'),
          (3, 2, 75.50, '2023-06-05'),
          (4, 3, 200.00, '2023-06-20'),
          (5, 3, 120.00, '2023-07-01'),
          (6, 4, 50.00, '2023-07-05'),
          (7, 5, NULL, '2023-07-10')
      `)

      database.query(`
        INSERT INTO discounts VALUES
          (1, 1, 10.00, 'First time buyer'),
          (2, 4, 5.00, 'Newsletter subscriber'),
          (3, 5, 15.00, 'Seasonal sale')
      `)

      setDb(database)
      setError(null)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [])

  const executeQuery = async (sql) => {
    if (!db) throw new Error('Database not initialized')

    try {
      const result = db.query(sql)
      return result
    } catch (err) {
      throw new Error(err.message)
    }
  }

  return { db, loading, error, executeQuery }
}
