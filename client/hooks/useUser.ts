import { MutationFunction, useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'

import * as API from '../apis/users'
import type { User } from '../../models/models'

// Hook to fetch current authenticated user from backend
export function useUser() {
  const { user: auth0User, getAccessTokenSilently } = useAuth0()

  const query = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return API.getCurrentUser(token)
    },
    enabled: !!auth0User,
  })

  return {
    ...query,
    add: useAddUser(), // for registering new user
  }
}

// Generic mutation hook with cache invalidation
export function useUserMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

// Mutation to add/register user
export function useAddUser() {
  return useUserMutation(API.addUser)
}
