
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useNotification } from '../../context/NotificationContext';

interface AllianceProps {}

const Alliance: React.FC<AllianceProps> = () => {
  const [userAlliance, setUserAlliance] = useState(null);
  const [availableAlliances, setAvailableAlliances] = useState([]);
  const [allianceLeaderboard, setAllianceLeaderboard] = useState([]);
  const [newAllianceName, setNewAllianceName] = useState('');
  const [newAllianceDesc, setNewAllianceDesc] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    loadAllianceData();
  }, []);

  const loadAllianceData = async () => {
    try {
      // Alliance leaderboard
      const leaderboardResponse = await fetch('/api/alliance/leaderboard');
      const leaderboardData = await leaderboardResponse.json();
      if (leaderboardData.success) {
        setAllianceLeaderboard(leaderboardData.data);
      }

      // Mavjud alliancelar
      const alliancesResponse = await fetch('/api/alliance/available');
      const alliancesData = await alliancesResponse.json();
      if (alliancesData.success) {
        setAvailableAlliances(alliancesData.data);
      }
    } catch (error) {
      console.error('Alliance data load error:', error);
    }
  };

  const createAlliance = async () => {
    if (!newAllianceName.trim()) {
      showNotification('Alliance nomini kiriting', 'error');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('telegramUser') || '{}');
      
      const response = await fetch('/api/alliance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAllianceName,
          description: newAllianceDesc,
          ownerId: user.id
        })
      });

      const result = await response.json();
      if (result.success) {
        showNotification('Alliance muvaffaqiyatli yaratildi! 🎉', 'success');
        setUserAlliance(result.data);
        setNewAllianceName('');
        setNewAllianceDesc('');
        loadAllianceData();
      }
    } catch (error) {
      showNotification('Alliance yaratishda xatolik yuz berdi', 'error');
    }
  };

  const joinAlliance = async (allianceId: number) => {
    try {
      const user = JSON.parse(localStorage.getItem('telegramUser') || '{}');
      
      const response = await fetch(`/api/alliance/${allianceId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const result = await response.json();
      if (result.success) {
        showNotification('Alliance ga muvaffaqiyatli qo\'shildingiz! 🤝', 'success');
        loadAllianceData();
      }
    } catch (error) {
      showNotification('Alliance ga qo\'shilishda xatolik yuz berdi', 'error');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">🤝 Alliance System</h1>
        <p className="text-gray-300">Birgalikda kuchga ega bo'ling!</p>
      </div>

      <Tabs defaultValue="my-alliance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-alliance">Mening Alliance</TabsTrigger>
          <TabsTrigger value="available">Mavjud Alliancelar</TabsTrigger>
          <TabsTrigger value="leaderboard">Reyting</TabsTrigger>
        </TabsList>

        <TabsContent value="my-alliance" className="space-y-4">
          {userAlliance ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-yellow-400">{userAlliance.name}</CardTitle>
                <CardDescription>{userAlliance.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">A'zolar soni</div>
                    <div className="text-2xl font-bold text-white">{userAlliance.members?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Umumiy assetlar</div>
                    <div className="text-2xl font-bold text-green-400">
                      ${userAlliance.totalAssets?.toLocaleString() || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Alliance darajasi</div>
                    <div className="text-2xl font-bold text-blue-400">{userAlliance.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Kunlik bonus</div>
                    <div className="text-2xl font-bold text-yellow-400">+1000 💰</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    💼 Alliance Assets
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    🎯 Jamoa Missiyalari
                  </Button>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    💬 Alliance Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Yangi Alliance Yaratish</CardTitle>
                  <CardDescription>
                    O'zingizning Alliance'ingizni yarating va do'stlaringizni taklif qiling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Alliance nomi"
                    value={newAllianceName}
                    onChange={(e) => setNewAllianceName(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Input
                    placeholder="Qisqa ta'rif (ixtiyoriy)"
                    value={newAllianceDesc}
                    onChange={(e) => setNewAllianceDesc(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                  <Button 
                    onClick={createAlliance}
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                  >
                    🏗️ Alliance Yaratish
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-blue-400">Alliance Imtiyozlari</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-300">
                    <li>✅ Kunlik 1000 coin bonus</li>
                    <li>✅ Jamoa missiyalari va mukofotlar</li>
                    <li>✅ Eksklyuziv NFT kolleksiyalari</li>
                    <li>✅ Trading da 10% bonus</li>
                    <li>✅ Alliance private chat</li>
                    <li>✅ Birgalikda business investment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Sample alliances */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-yellow-400">Dubai Elite</CardTitle>
                    <CardDescription>Top players alliance for serious business</CardDescription>
                  </div>
                  <Badge className="bg-yellow-500">Level 5</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">A'zolar</div>
                      <div className="font-bold">25/30</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Assets</div>
                      <div className="font-bold text-green-400">$2.5M</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Kun. Bonus</div>
                      <div className="font-bold text-blue-400">+5000</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => joinAlliance(1)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Qo'shilish
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-yellow-400">Crypto Kings</CardTitle>
                    <CardDescription>NFT va crypto enthusiastlar uchun</CardDescription>
                  </div>
                  <Badge className="bg-blue-500">Level 3</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">A'zolar</div>
                      <div className="font-bold">18/25</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Assets</div>
                      <div className="font-bold text-green-400">$800K</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Kun. Bonus</div>
                      <div className="font-bold text-blue-400">+3000</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => joinAlliance(2)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Qo'shilish
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-yellow-400">🏆 Top Alliancelar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Dubai Elite', assets: 2500000, members: 25, level: 5 },
                  { rank: 2, name: 'Crypto Kings', assets: 800000, members: 18, level: 3 },
                  { rank: 3, name: 'Business Tycoons', assets: 650000, members: 22, level: 4 },
                  { rank: 4, name: 'NFT Collectors', assets: 400000, members: 15, level: 2 },
                  { rank: 5, name: 'Trading Masters', assets: 350000, members: 20, level: 3 }
                ].map((alliance) => (
                  <div key={alliance.rank} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        alliance.rank === 1 ? 'bg-yellow-500' :
                        alliance.rank === 2 ? 'bg-gray-400' :
                        alliance.rank === 3 ? 'bg-orange-500' : 'bg-gray-600'
                      }`}>
                        {alliance.rank}
                      </div>
                      <div>
                        <div className="font-bold text-white">{alliance.name}</div>
                        <div className="text-sm text-gray-400">
                          {alliance.members} members • Level {alliance.level}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">
                        ${alliance.assets.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-400">Total Assets</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alliance;
