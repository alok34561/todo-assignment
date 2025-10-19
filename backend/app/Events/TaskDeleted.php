<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class TaskDeleted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Task $task, public ?int $deletedBy = null)
    {
        $this->broadcastToSocket();
    }

    private function broadcastToSocket()
    {
        try {
            \Log::info('Broadcasting task.deleted event for task ID: ' . $this->task->id);
            $response = Http::post(config('constants.SOCKET_URL'), [
                'event' => 'task.deleted',
                'data' => [
                    'task' => $this->task,
                    'deletedBy' => $this->deletedBy
                ]
            ]);
            \Log::info('Socket broadcast response: ' . $response->body());
        } catch (\Exception $e) {
            \Log::error('Socket broadcast failed: ' . $e->getMessage());
        }
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('tasks'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'task.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task
        ];
    }
}
