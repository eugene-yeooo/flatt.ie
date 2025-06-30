import { MutationFunction, useQuery } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import * as API from '../apis/users'

import { useAuth0 } from '@auth0/auth0-react'

export function useUser() {
  const { user, getAccessTokenSilently } = useAuth0()

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return API.getCurrentUser(token)
    },
    enabled: !!user, // Only fetch if Auth0 user is present
  })

  return {
    ...query,
    add: useAddUser(), // Mutation hook to add user
  }
}

// Generic mutation hook with cache invalidation for 'user'
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

// mutation hook to add a user
export function useAddUser() {
  return useUserMutation(API.addUser)
}
