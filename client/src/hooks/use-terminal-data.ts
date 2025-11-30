import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api";

export function useLogs(limit: number = 50) {
  return useQuery({
    queryKey: ["logs", limit],
    queryFn: () => api.fetchLogs(limit),
    refetchInterval: 3000, // Auto-refresh every 3 seconds for live feel
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ level, message }: { level: string; message: string }) =>
      api.createLog(level, message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}

export function useFiles() {
  return useQuery({
    queryKey: ["files"],
    queryFn: api.fetchFiles,
  });
}

export function useMessages() {
  return useQuery({
    queryKey: ["messages"],
    queryFn: api.fetchMessages,
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.markMessageAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useContextChirps(limit: number = 20) {
  return useQuery({
    queryKey: ["context-chirps", limit],
    queryFn: () => api.fetchContextChirps(limit),
  });
}

export function useCreateContextChirp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: string) => api.createContextChirp(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["context-chirps"] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, isChirp }: { content: string; isChirp: boolean }) =>
      api.createPost(content, isChirp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}
