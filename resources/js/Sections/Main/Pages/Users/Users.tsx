import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import {paginatedValue} from '-ts/paginatedValue'
import {PageSpinner, Pagination, Select} from '<>'
import error from './Types/user'
import Card from './Template/Card/Card'
import api from '@/Utils/api'
import { Link } from 'react-router-dom'

export default function Users() {
  const [url, setUrl] = useState("/api/users")
  const [orderBy, setOrderBy] = useState("id")
  const [order, setOrder] = useState("desc")
  
  const {data, refetch, isFetching} = useQuery('getUsers',async ()=> await api.get<paginatedValue<error[]>>
  (
    url, 
    {params:{orderBy, order}
  }))

  useEffect(()=>{
    refetch()
  },[url, order, orderBy])

  return (
    <div className='w-full h-full gap-2 flex flex-col relative'>
      <header className="text-2xl">
        <h1>Usuários:</h1>
      </header>
      <div className='flex flex-col items-start w-full h-full flex-1 gap-2'>
          {
            isFetching
            ?
              <PageSpinner size='text-7xl'/>
            :
              <>
                {/* orderby */}
                <div className='flex gap-2 w-full'>
                  <div className='grid'>
                    <span>Ordernar por: </span>
                    <Select 
                      onChange={({target})=>setOrderBy((target as HTMLSelectElement).value)}
                      value={orderBy}
                    >
                      <option value="id">ID</option>
                      <option value="name">Nome</option>
                      <option value="email">Email</option>
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
                  <Link to="novo" className="ml-auto bg-red text-white flex flex-col">
                    <div className="bg-black hover:bg-gray-700 transition-colors rounded-md p-2 mt-auto">
                      Novo
                    </div>
                  </Link>
                  
                </div>
                <ul className='grid gap-2 w-full pb-3'>
                  {data?.data.data.map((user)=>(
                    <Card user={user} onDelete={refetch} key={user.id}/>
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
