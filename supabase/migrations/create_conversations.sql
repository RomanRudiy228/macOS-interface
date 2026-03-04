-- Create conversations table
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT different_participants CHECK (participant_1_id != participant_2_id),
  CONSTRAINT ordered_participants CHECK (participant_1_id < participant_2_id),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Create index for quick lookups
CREATE INDEX idx_conversations_participants 
  ON conversations(participant_1_id, participant_2_id);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_edited boolean DEFAULT false
);

-- Create index for fast message retrieval
CREATE INDEX idx_messages_conversation 
  ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender 
  ON messages(sender_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Conversations RLS policies
CREATE POLICY conversations_viewable_for_participants 
  ON conversations FOR SELECT 
  USING (
    auth.uid() = participant_1_id 
    OR auth.uid() = participant_2_id
  );

CREATE POLICY conversations_insertable_by_participants 
  ON conversations FOR INSERT 
  WITH CHECK (
    (auth.uid() = participant_1_id OR auth.uid() = participant_2_id)
    AND participant_1_id < participant_2_id
  );

-- Messages RLS policies
CREATE POLICY messages_viewable_for_participants 
  ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = messages.conversation_id 
      AND (conversations.participant_1_id = auth.uid() 
           OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY messages_insertable_by_sender 
  ON messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
      SELECT 1 FROM conversations 
      WHERE conversations.id = conversation_id 
      AND (conversations.participant_1_id = auth.uid() 
           OR conversations.participant_2_id = auth.uid())
    )
  );

CREATE POLICY messages_updatable_by_sender 
  ON messages FOR UPDATE 
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);
