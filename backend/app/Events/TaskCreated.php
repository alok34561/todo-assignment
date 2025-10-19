<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;

class TaskCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Task $task)
    {
        $this->broadcastToSocket();
    }

    private function broadcastToSocket()
    {
        try {
            Http::post(config('constants.SOCKET_URL'), [
                'event' => 'task.created',
                'data' => ['task' => $this->task->load('user:id,name,email')]
            ]);
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
        return 'task.created';
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->load('user:id,name,email')
        ];
    }
}
