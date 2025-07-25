import { useGame } from "@/hooks/use-game";
import { StatusBar } from "@/components/game/status-bar";
import { BottomNavigation } from "@/components/game/bottom-navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatNumber, showToast } from "@/lib/game-utils";
import { CheckCircle, Circle, Award, Users, Share2 } from "lucide-react";

export default function TasksPage() {
  const { user } = useGame();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks', user?.id],
    enabled: !!user,
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiRequest('POST', '/api/tasks/complete', {
        userId: user?.id,
        taskId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', user?.telegramId] });
      showToast('Task completed! Reward claimed.', 'success');
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please open in Telegram</div>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.isCompleted);
  const availableTasks = tasks.filter(task => !task.isCompleted);

  // Mock tasks for demonstration
  const mockTasks = [
    {
      id: 1,
      type: 'social',
      title: 'Join Dubai City Channel',
      description: 'Subscribe to our Telegram channel for updates',
      reward: 5000,
      isCompleted: false,
      icon: Share2,
    },
    {
      id: 2,
      type: 'social',
      title: 'Share with Friends',
      description: 'Share Dubai City with 5 friends',
      reward: 10000,
      isCompleted: false,
      icon: Users,
    },
    {
      id: 3,
      type: 'daily',
      title: 'Daily Login',
      description: 'Login for 7 consecutive days',
      reward: 15000,
      isCompleted: false,
      icon: Award,
    },
    {
      id: 4,
      type: 'referral',
      title: 'Invite 3 Friends',
      description: 'Invite 3 friends to join Dubai City',
      reward: 25000,
      isCompleted: false,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <StatusBar />
      
      <div className="flex-1 px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-dubai-gold mb-2">
            Tasks & Missions
          </h1>
          <div className="bg-dubai-card rounded-lg p-4">
            <div className="text-dubai-gold font-bold text-lg">
              {completedTasks.length} / {tasks.length || mockTasks.length}
            </div>
            <div className="text-sm text-gray-400">Tasks Completed</div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Available Tasks */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">
              Available Tasks
            </h2>
            <div className="space-y-3">
              {(availableTasks.length > 0 ? availableTasks : mockTasks).map((task) => (
                <div key={task.id} className="task-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-dubai-gold rounded-full flex items-center justify-center mr-3">
                        {task.icon ? (
                          <task.icon className="w-5 h-5 text-dubai-dark" />
                        ) : (
                          <Circle className="w-5 h-5 text-dubai-dark" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{task.title}</div>
                        <div className="text-sm text-gray-400">
                          {task.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-dubai-gold font-bold">
                        +{formatNumber(task.reward)}
                      </div>
                      <button
                        onClick={() => completeTaskMutation.mutate(task.id)}
                        disabled={completeTaskMutation.isPending}
                        className="text-xs bg-dubai-gold text-dubai-dark px-3 py-1 rounded-full mt-1 hover:bg-yellow-400 disabled:opacity-50"
                      >
                        {completeTaskMutation.isPending ? 'Claiming...' : 'Claim'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                Completed Tasks
              </h2>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <div key={task.id} className="task-card completed">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-white">{task.title}</div>
                          <div className="text-sm text-gray-400">
                            {task.description}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold">
                          +{formatNumber(task.reward)}
                        </div>
                        <div className="text-xs text-green-400">
                          Completed
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
