"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";
import { Loader2, Mail, Phone, RefreshCw, Search, User, Users } from "lucide-react";
import { useState } from "react";
import { AgentForm } from "./AgentsForm";

interface AgentsListProps {
  initialAgents?: (AgentsResponse & { expand?: { user_id?: UsersResponse } })[];
  currentUser: { is_admin?: boolean; id: string };
}

export function AgentsList({ initialAgents = [], currentUser }: AgentsListProps) {
  const [agents, setAgents] = useState(initialAgents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const filteredAgents = agents.filter((agent) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      agent.name?.toLowerCase().includes(searchLower) ||
      agent.email?.toLowerCase().includes(searchLower) ||
      agent.phone?.toLowerCase().includes(searchLower) ||
      agent.expand?.user_id?.name?.toLowerCase().includes(searchLower) ||
      agent.expand?.user_id?.email?.toLowerCase().includes(searchLower)
    );
  });

  const refreshAgents = async () => {
    setIsLoading(true);
    try {
      // Note: This would typically fetch from the server
      // For now, we'll just indicate refresh completed
      console.log("Refreshing agents...");
    } catch (error) {
      console.error("Error refreshing agents:", error);
    }
    setIsLoading(false);
  };

  if (showForm) {
    return (
      <AgentForm 
        initialAgents={agents} 
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Agents</h1>
          <Badge variant="secondary">{agents.length}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAgents}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {currentUser.is_admin && (
            <Button onClick={() => setShowForm(true)}>
              Manage Agents
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search agents by name, email, phone, or user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading agents...</span>
        </div>
      )}

      {/* Agents Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {searchQuery ? "No matching agents found" : "No Agents Found"}
                </h3>
                <p className="text-muted-foreground text-center">
                  {searchQuery 
                    ? "Try adjusting your search terms." 
                    : currentUser.is_admin
                      ? "Get started by creating your first agent profile."
                      : "No agents have been created yet."
                  }
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAgents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{agent.name || "Unnamed Agent"}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        {agent.expand?.user_id?.name || agent.expand?.user_id?.email || "Unknown User"}
                      </CardDescription>
                    </div>
                    
                    <Badge variant="secondary" className="text-xs">
                      Agent
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {agent.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                  )}
                  
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      Created {new Date(agent.created).toLocaleDateString()}
                    </span>
                    {agent.expand?.user_id?.is_admin && (
                      <Badge variant="outline" className="text-xs">
                        Admin User
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
