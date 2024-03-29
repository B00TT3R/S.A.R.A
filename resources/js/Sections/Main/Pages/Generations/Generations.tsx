import api from '@/Utils/api'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import {paginatedValue} from '-ts/paginatedValue'
import {PageSpinner, Pagination, Select} from '<>'
import generation from './Types/generation'
import Card from './Template/Card/Card'

export default function Errors() {
  const [url, setUrl] = useState("/api/generations")
  const [orderBy, setOrderBy] = useState("id")
  const [order, setOrder] = useState("desc")
  
  const {data, refetch, isFetching} = useQuery('getErrors',async ()=> await api.get<paginatedValue<generation[]>>(url, 
    {params:{orderBy, order}
  }))

  useEffect(()=>{
    refetch()
  },[url, order, orderBy])

  return (
    <div className='w-full h-full gap-2 flex flex-col relative'>
      <header className="text-2xl">
        <h1>Gerações:</h1>
      </header>
      <div className='flex flex-col items-start w-full h-full flex-1 gap-2'>
          {
            isFetching
            ?
              <PageSpinner size='text-7xl'/>
            :
              <>
                {/* orderby */}
                <div className='flex gap-2'>
                  <div className='grid'>
                    <span>Ordernar por: </span>
                    <Select 
                      onChange={({target})=>setOrderBy((target as HTMLSelectElement).value)}
                      value={orderBy}
                    >
                      <option value="id">ID</option>
                      <option value="type">Tipo</option>
                    </Select>
                  </div>
                  <div className='grid'>
                    <span>Ordem: </span>
                    <Select 
                      onChange={({target})=>setOrder((target as HTMLSelectElement).value)}
                      value={order}
                    >
                      <option value="asc">Crescente</option>
                      <option value="desc">Decrescente</option>
                    </Select>
                  </div>
                </div>
                <ul className='grid gap-2 w-full pb-3'>
                  {data?.data.data.map((error)=>(
                    <Card error={error} key={error.id}/>
                  ))}
                </ul>
                <div className='sticky bottom-0 w-full'>
                  <Pagination
                    data={data!.data}
                    handleChange={setUrl}
                  />
                </div>
              </>
          }
      </div>
      
    </div>
  )
}
