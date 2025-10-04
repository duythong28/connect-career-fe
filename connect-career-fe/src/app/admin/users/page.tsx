'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for admin users page
const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'candidate',
    avatar: '/api/placeholder/50/50',
    status: 'active',
    joinedDate: '2024-01-15'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'employer',
    avatar: '/api/placeholder/50/50',
    status: 'active',
    joinedDate: '2024-01-10'
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'candidate',
    avatar: '/api/placeholder/50/50',
    status: 'banned',
    joinedDate: '2024-01-05'
  },
  {
    id: 'user4',
    name: 'Alice Wilson',
    email: 'alice@example.com',
    role: 'admin',
    avatar: '/api/placeholder/50/50',
    status: 'active',
    joinedDate: '2023-12-20'
  }
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'active' | 'banned';
  joinedDate: string;
}

// Mock UserEditDialog component (placeholder)
const UserEditDialog = ({ user, open, onOpenChange, onSave }: any) => {
  return null; // This would be implemented with the actual dialog
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSaveUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    setEditingUser(null);
    toast({
      title: "User updated",
      description: "User information has been updated successfully."
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage user accounts and permissions</p>
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="candidate">Candidates</SelectItem>
                <SelectItem value="employer">Employers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinedDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingUser(user as any)}>
                           <Edit className="h-4 w-4" />
                         </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            const updatedUsers = users.map(u => 
                              u.id === user.id 
                                ? { ...u, status: (u.status === 'active' ? 'banned' : 'active') as 'active' | 'banned' }
                                : u
                            );
                            setUsers(updatedUsers);
                            toast({
                              title: `User ${user.status === 'active' ? 'banned' : 'activated'}`,
                              description: `${user.name} has been ${user.status === 'active' ? 'banned' : 'activated'}.`
                            });
                          }}
                        >
                          {user.status === 'active' ? 'Ban' : 'Unban'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <UserEditDialog 
        user={editingUser as any}
        open={!!editingUser}
        onOpenChange={(open: boolean) => !open && setEditingUser(null)}
        onSave={handleSaveUser as any}
      />
    </div>
  );
}