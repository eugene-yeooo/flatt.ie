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

//Update profile hook
export function useEditProfile() {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const mutationFn = async (formData: FormData): Promise<User | null> => {
    const token = await getAccessTokenSilently()
    return API.editProfile(formData, token)
  }

  return useMutation<User | null, Error, FormData>({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  })
}

//Get all users
export function useAllUsers() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery<User[] | null, Error>({
    queryKey: ['users'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return API.getAllUsers(token)
    },
    enabled: isAuthenticated,
    retry: false,
  })
}
