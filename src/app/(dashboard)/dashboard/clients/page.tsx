import { getClients, deleteClient } from "@/actions/client-actions";
import { ClientDialog } from "@/components/modules/client-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// ১. ক্লায়েন্ট এর টাইপ ডিফাইন করা (Type Definition)
interface Client {
  _id: string;
  name: string;
  email?: string; // ? মানে হলো এটি থাকতেও পারে নাও থাকতে পারে
  phone?: string;
  address?: string;
  createdAt?: string;
}

export default async function ClientsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // ২. ডাটাকে সঠিক টাইপে কাস্ট করা
  const clients: Client[] = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <ClientDialog />
      </div>

      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                  No clients found. Add your first client!
                </TableCell>
              </TableRow>
            ) : (
              // ৩. এখানে এখন আর any নেই, টাইপস্ক্রিপ্ট জানে client এর মধ্যে কি আছে
              clients.map((client) => (
                <TableRow key={client._id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.email || "-"}</TableCell>
                  <TableCell>{client.phone || "-"}</TableCell>
                  <TableCell className="text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteClient(client._id);
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}