import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const Chatloading = () => {
  return (
    <div>
        <Stack>
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
            <Skeleton height={45} />
        </Stack>
    </div>
  )
}

export default Chatloading