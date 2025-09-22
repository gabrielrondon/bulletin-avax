# L1 Explorer Guide

## Master the Avalanche L1 Network Discovery Tool

The **L1 Explorer** is your gateway to understanding the entire Avalanche ecosystem. With over 300 Layer 1 networks in production, the L1 Explorer provides comprehensive visibility into network details, capabilities, and real-time status.

:::tip Explorer vs Traditional Tools
Unlike blockchain explorers that show transaction history, the L1 Explorer focuses on **network discovery** and **ecosystem intelligence**.
:::

## 🔍 **Interface Overview**

### **Main Explorer View**

The L1 Explorer presents networks in a clean, organized grid layout:

```
┌─────────────────┬─────────────────┬─────────────────┐
│   Network A     │   Network B     │   Network C     │
│   🎮 Gaming     │   💰 DeFi       │   🏢 Enterprise │
│   EVM Compatible│   Custom VM     │   Private VM    │
│   ICM: ✅ Yes   │   ICM: ❌ No    │   ICM: ✅ Yes   │
│   [Explorer] 🔗 │   [Explorer] 🔗 │   [Explorer] 🔗 │
└─────────────────┴─────────────────┴─────────────────┘
```

### **Network Cards Information**

Each network card displays critical information:

**Network Identity**:
- **L1 Name**: Human-readable network name
- **Category Icon**: Visual indicator of network type
- **Blockchain ID**: Unique technical identifier

**Technical Details**:
- **VM Type**: EVM-compatible or Custom VM
- **ICM Support**: Cross-chain communication capability
- **Validator Count**: Network security indicators

**Quick Actions**:
- **Explorer Link**: Direct access to network-specific explorer
- **Details View**: Expanded network information
- **Performance Metrics**: Quick access to analytics

## 🔧 **Search and Filter Tools**

### **Search Functionality**

**Network Name Search**:
```
Search Box: "GUNZ" → Shows all networks matching "GUNZ"
```

**Blockchain ID Search**:
```
Search Box: "2vcBHFK7jiv74dyYeUCUiCsKy2jbWx6xEQzNfQPiLmYidBaDfX"
→ Shows specific network by ID
```

**Partial Matching**:
- Search works with partial network names
- Case-insensitive matching
- Real-time filtering as you type

### **Filter Options**

**VM Type Filtering**:
- **All VMs**: Show every network type
- **EVM Only**: Ethereum-compatible networks
- **Custom VMs**: Specialized virtual machines
- **Unknown**: Networks with unidentified VMs

**ICM Capability Filtering**:
- **All Networks**: Every L1 network
- **ICM Enabled**: Cross-chain communication ready
- **ICM Disabled**: Traditional isolated networks

**Network Category** (Visual Indicators):
- 🎮 **Gaming**: Game-focused L1 networks
- 💰 **DeFi**: Financial application networks
- 🏢 **Enterprise**: Business and private networks
- 🎨 **NFT/Media**: Content and media platforms
- ⚡ **Infrastructure**: Core protocol networks

## 📊 **Network Details Deep Dive**

### **Technical Specifications**

Click any network card to access detailed information:

**Core Identifiers**:
```
L1 Name: GUNZ Blockchain
Blockchain ID: 2vcBHFK7jiv74dyYeUCUiCsKy2jbWx6xEQzNfQPiLmYidBaDfX
VM ID: mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6
VM Type: Subnet-EVM (Ethereum Compatible)
```

**Network Configuration**:
```
Chain ID: 51048
Block Time: ~2 seconds
Consensus: Avalanche Snowman
ICM Support: ✅ Enabled
```

**Validator Information**:
```
Total Validators: 847 nodes
Active Validators: 847 nodes
Stake Distribution: Well distributed
Geographic Spread: Global
```

### **ICM Capability Analysis**

**ICM Status Detection**:
The platform uses advanced heuristics to determine ICM support:

```typescript
ICM Detection Logic:
1. Known ICM VM IDs (definitive)
2. Modern VM characteristics (likely)
3. Network configuration flags (possible)
4. Community reporting (manual verification)
```

**ICM Readiness Indicators**:
- ✅ **Confirmed**: Verified ICM implementation
- ⚡ **Likely**: Modern VM with ICM characteristics
- ❓ **Unknown**: Unable to determine capability
- ❌ **No**: Confirmed non-ICM network

## 🌐 **Explorer Link Intelligence**

### **Multi-Explorer Support**

Different networks require different explorers for optimal viewing:

**Primary Explorers**:
- **Avascan**: [avascan.info](https://avascan.info) - Comprehensive C-Chain and L1 support
- **Snowscan**: [snowscan.xyz](https://snowscan.xyz) - Specialized L1 network explorer
- **Subnets.avax**: [subnets.avax.network](https://subnets.avax.network) - Official Avalanche explorer

**Explorer Selection Logic**:
```typescript
if (networkType === 'indexed_subnet') {
  return `https://avascan.info/blockchain/${blockchainId}`;
} else {
  return `https://snowscan.xyz/blockchain/${blockchainId}`;
}
```

### **Explorer Capabilities**

**What You Can Find in Explorers**:
- **Transaction History**: All network transactions
- **Block Information**: Block details and timestamps
- **Smart Contracts**: Deployed contract verification
- **Token Information**: ERC-20 and native tokens
- **Validator Details**: Staking and delegation info

**Explorer Limitations**:
- Some explorers may show "Not Indexed" for newer networks
- Private networks may not be publicly explorable
- Custom VMs might have limited explorer support

:::tip Explorer Best Practices
If Avascan shows "thinking" or loading issues, try the Snowscan link. Different explorers have different network indexing priorities.
:::

## 📈 **Network Categories and Use Cases**

### **Gaming L1 Networks** 🎮

**Characteristics**:
- High-throughput transaction processing
- Low or zero transaction fees
- Gaming-optimized smart contracts
- NFT and in-game asset support

**Popular Gaming L1s**:
- **GUNZ**: Battle Royale gaming platform
- **Beam**: Game development integration platform
- **Shrapnel**: AAA gaming blockchain

**What to Look For**:
- EVM compatibility for easy development
- High TPS for game actions
- ICM support for cross-game assets

### **DeFi L1 Networks** 💰

**Characteristics**:
- Financial protocol optimization
- Advanced privacy features
- Custom tokenomics support
- Cross-chain liquidity integration

**Popular DeFi L1s**:
- **Dexalot**: Decentralized exchange platform
- **Trader Joe**: DeFi protocol suite
- **Various yield farming platforms**

**What to Look For**:
- ICM enabled for cross-chain DeFi
- Ethereum compatibility for DeFi primitives
- Strong validator security

### **Enterprise L1 Networks** 🏢

**Characteristics**:
- Private or permissioned access
- Compliance and audit features
- Integration with existing systems
- Custom governance models

**Use Cases**:
- Supply chain tracking
- Financial institution networks
- Healthcare data sharing
- Government applications

**What to Look For**:
- Custom VMs for specific requirements
- Private network configurations
- Institutional-grade security

### **NFT & Media L1s** 🎨

**Characteristics**:
- Media storage and transfer optimization
- Content verification systems
- Royalty and licensing management
- High-throughput minting capabilities

**Popular Media L1s**:
- **Numbers Protocol**: Decentralized photo network
- **Various art and content platforms**

**What to Look For**:
- Specialized storage solutions
- Content authenticity features
- Cross-platform compatibility

## 🔍 **Discovery Strategies**

### **Finding New Opportunities**

**Growth Network Discovery**:
1. **Filter by ICM**: Find modern, interconnected networks
2. **Check Validator Count**: Higher counts indicate adoption
3. **Analyze VM Types**: EVM networks are developer-friendly
4. **Monitor Recent Networks**: Look for emerging ecosystems

**Investment Research**:
1. **Performance Correlation**: Use Performance Dashboard
2. **Cross-Chain Activity**: Check ICM Hub for usage
3. **Validator Security**: Analyze stake distribution
4. **Explorer Activity**: Review transaction volume

### **Technical Integration Research**

**Developer Network Selection**:
1. **VM Compatibility**: Match your technical stack
2. **ICM Requirements**: Assess cross-chain needs
3. **Performance Needs**: Check TPS and block time
4. **Cost Considerations**: Analyze transaction fees

**Partnership Opportunities**:
1. **Ecosystem Fit**: Find complementary networks
2. **Cross-Chain Potential**: Identify ICM partnerships
3. **Market Positioning**: Analyze competitive landscape
4. **Technical Synergies**: Find compatible technologies

## 📊 **Integration with Other Platform Tools**

### **Performance Analysis Integration**

**From L1 Explorer to Performance Dashboard**:
- Click any network to see detailed performance metrics
- Compare multiple networks side-by-side
- Analyze historical performance trends
- Monitor real-time network health

### **ICM Hub Integration**

**Cross-Chain Discovery**:
- Identify ICM-enabled networks in Explorer
- Track their cross-chain activity in ICM Hub
- Analyze message patterns and routes
- Monitor cross-chain adoption trends

### **Validator Intelligence Integration**

**Security and Staking Analysis**:
- View validator counts in Explorer
- Deep dive into validator details in Validator Intelligence
- Analyze staking opportunities across networks
- Assess security guarantees for each L1

## 🛠️ **Power User Tips**

### **Advanced Search Techniques**

**Bookmark Important Networks**:
```
Browser Bookmarks:
- bookmark://bulletin-avax/explorer?search=gunz
- bookmark://bulletin-avax/explorer?filter=icm-enabled
- bookmark://bulletin-avax/explorer?category=gaming
```

**Quick Network Access**:
- Use browser search suggestions
- Bookmark specific network detail pages
- Set up custom filters for your research focus

### **Research Workflows**

**Investment Analysis Workflow**:
1. **Discover**: Use L1 Explorer to find networks
2. **Analyze**: Check Performance Dashboard metrics
3. **Validate**: Review Validator Intelligence data
4. **Monitor**: Track ICM Hub cross-chain activity

**Integration Planning Workflow**:
1. **Requirements**: Define technical needs
2. **Discovery**: Filter L1s by requirements
3. **Evaluation**: Deep dive into candidate networks
4. **Testing**: Use explorer links for hands-on testing

## 🔗 **Next Steps**

Ready to master L1 discovery?

1. **[Performance Dashboard](./analytics)** - Analyze network metrics
2. **[ICM Hub Guide](./icm-hub)** - Track cross-chain activity
3. **[Validator Intelligence](./validators)** - Assess network security
4. **[Network Architecture](../avalanche/network-architecture)** - Understand the technical foundations

---

**Start exploring now**: Visit [**Bulletin AVAX L1 Explorer**](https://bulletin-avax.vercel.app) and discover the full Avalanche ecosystem!

*Your gateway to 300+ Layer 1 networks and endless possibilities.*